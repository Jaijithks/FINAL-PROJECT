#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ESP32Servo.h>
#include "time.h"

#define TRIG_PIN 5
#define ECHO_PIN 18

// WIFI
const char* ssid = "project";
const char* password = "project@1";

// SUPABASE
const char* supabaseUrl = "https://vukforaoffuwdopuzsku.supabase.co/rest/v1/rain_reading";
const char* apiKey = "sb_publishable_bFW1vpM5F-BLr31aVzfFzg_vZbvupy5";

// NTP
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 19800;
const int   daylightOffset_sec = 0;

// SERVO
Servo myservo;
int servoPin = 14;

// TIMER
unsigned long startTime;
int drop_time = 10;

// CONTAINER DETAILS
float funnelRadius = 7.0;
float containerHeight = 11.73;

float area;
float distance;
float waterHeight;
float waterVolume;
float rainfall;

long duration;

void setup() {

  Serial.begin(115200);

  // WIFI CONNECT
  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected");

  // INIT TIME
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // CALCULATE AREA
  area = 3.1416 * 25;

  startTime = millis();

  myservo.attach(servoPin);
  myservo.write(0);

  Serial.println("Ultrasonic Rain Gauge Started");
}

void loop() {

  unsigned long elapsedTime = millis() - startTime;

  Serial.print("Time: ");
  Serial.print(elapsedTime / 1000);
  Serial.println(" sec");

  // TRIGGER SENSOR
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  duration = pulseIn(ECHO_PIN, HIGH, 30000);

  // DISTANCE
  distance = duration * 0.034 / 2;

  // WATER HEIGHT
  waterHeight = containerHeight - distance;

  if (waterHeight < 0) waterHeight = 0;
  if (waterHeight > containerHeight) waterHeight = containerHeight;

  // WATER VOLUME
  waterVolume = area * waterHeight;

  // RAINFALL (Corrected equation)
  rainfall = 17.77 * waterHeight;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.print(" cm");

  Serial.print(" | Water Height: ");
  Serial.print(waterHeight);
  Serial.print(" cm");

  Serial.print(" | Water Volume: ");
  Serial.print(waterVolume);
  Serial.print(" ml");

  Serial.print(" | Rainfall: ");
  Serial.print(rainfall);
  Serial.println(" mm");

  // SEND DATA
  sendToSupabase(rainfall);
  delay(1900);

  // AUTO DRAIN WATER
  if (elapsedTime / 1000 > drop_time) {

    Serial.println("Draining water...");

    myservo.write(90);
    delay(2000);

    myservo.write(0);
    delay(2000);

    startTime = millis();
  }

  delay(1000);
}

String getCurrentTimeISO() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return "1970-01-01T00:00:00Z";
  }

  char timeString[30];
  strftime(timeString, sizeof(timeString), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(timeString);
}

void sendToSupabase(float rainValue) {

  if (WiFi.status() == WL_CONNECTED) {

    WiFiClientSecure client;
    client.setInsecure();

    HTTPClient http;

    http.begin(client, supabaseUrl);

    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", apiKey);
    http.addHeader("Authorization", String("Bearer ") + apiKey);

    String jsonData = "{";
    jsonData += "\"gauge_value\":" + String(rainValue) + ",";
    jsonData += "\"place\":\"rain_gauge_1\",";
    jsonData += "\"recorded_at\":\"" + getCurrentTimeISO() + "\"";
    jsonData += "}";

    int httpResponseCode = http.POST(jsonData);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    String response = http.getString();
    Serial.println("Server response:");
    Serial.println(response);

    http.end();
  }
}