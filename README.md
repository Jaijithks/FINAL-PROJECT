# ReadEase: Automatic Rain Gauge Meter Reading System

This project presents a low-cost and automated rainfall measurement system that uses sensor-based technology and embedded processing to measure rainfall accurately without manual intervention.

The system collects rainwater through a funnel, measures the water level using an ultrasonic sensor, and computes rainfall using an ESP32 microcontroller. It also includes an automatic drainage mechanism using a servo motor to enable continuous operation.

---

## Features

- Automated rainfall measurement without manual observation  
- Ultrasonic sensor-based non-contact water level detection  
- ESP32-based real-time data processing  
- Rainfall calculation using standard catchment area method  
- Automatic drainage system using servo motor  
- Low-cost and scalable design  
- Suitable for environmental monitoring and agricultural applications  

---

## System Components

### Hardware

- ESP32 Microcontroller  
- Ultrasonic Sensor (HC-SR04)  
- Rainwater Funnel (Known Catchment Area)  
- Water Collection Container  
- Servo Motor (for automatic drainage)  
- Power Supply Module  

---

## Working Principle

1. Rainwater is collected through a funnel with a fixed catchment area.  
2. Water flows into a collection container.  
3. The ultrasonic sensor measures the distance to the water surface.  
4. As water level rises, the measured distance decreases.  
5. ESP32 calculates water height using distance difference.  
6. Rainfall is computed in millimeters.  
7. After a fixed interval, the servo motor drains the container.  
8. The system resets for the next measurement cycle.  

---

## Requirements

### Hardware Requirements

- ESP32 Development Board  
- Ultrasonic Sensor (HC-SR04)  
- Servo Motor  
- Funnel and Container Setup  
- Connecting wires and power supply  

### Software Requirements

- Arduino IDE / PlatformIO  
- ESP32 Board Package  

#### Required Libraries:
- WiFi.h  
- HTTPClient.h  
- ESP32Servo.h  

---

## Setup & Run

1. Connect hardware:
   - Ultrasonic Sensor → ESP32 (TRIG & ECHO pins)  
   - Servo Motor → ESP32 PWM pin  
   - Power supply connections  

2. Open the code in Arduino IDE  

3. Install required libraries  

4. Configure:
   - WiFi credentials  
   - API/server endpoint (if used)  

5. Upload code to ESP32  

6. Open Serial Monitor to view:
   - Distance  
   - Water Height  
   - Rainfall values  

---

## Output

The system provides:

- Distance from sensor (cm)  
- Water level (cm)  
- Water volume (ml)  
- Rainfall (mm)  

---

## Advantages

- Eliminates manual measurement errors  
- No mechanical wear (compared to tipping bucket)  
- Cost-effective and easy to build  
- Continuous monitoring capability  
- Suitable for remote and rural deployment  

---

## Applications

- Agriculture and irrigation planning  
- Weather monitoring systems  
- Flood prediction studies  
- Environmental data collection  
- Academic and research projects  

---

## Future Enhancements

- Solar-powered operation  
- Mobile app integration  
- Cloud-based data storage  
- Multi-location deployment network  
- Integration with complete weather monitoring system  

---

## Author

Developed as part of a B.Tech Final Year Project.


## Git-hub LINK!!!

https://github.com/Jaijithks/FINAL-PROJECT
