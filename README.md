# 🎵 Spotify Personal Analytics Dashboard

![Dashboard Preview](https://img.shields.io/badge/Status-Live-success?style=for-the-badge) ![Tech Stack](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js) ![Tech Stack](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![Tech Stack](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

**Live Demo:** [spotify-personal-analytics.vercel.app](https://spotify-personal-analytics.vercel.app)

A full-stack, fully automated personal music analytics dashboard. This project tracks Spotify listening history in real-time, enriches the data with deep audio intelligence (BPM, energy, danceability), and displays it on a beautifully designed, mobile-responsive Next.js interface.

## ✨ Features
- **Real-Time Data Pipeline:** A Python ETL script automatically runs every 2 hours via GitHub Actions to fetch the latest listening history from the Spotify API.
- **Deep Audio Intelligence:** Integrates with the Melodata API to analyze the musical key, tempo, and mood of every track listened to.
- **Cloud Database Architecture:** All data is securely stored and queried dynamically from a cloud-hosted Aiven MySQL database.
- **Dynamic Taste Evaluation:** Radar charts compare your all-time listening habits versus your last 4 weeks to visualize how your music taste is evolving.
- **Fully Responsive UI:** Built with Next.js and custom CSS, providing a seamless experience on both desktop and mobile devices.

## 🏗️ Architecture
1. **Frontend:** Next.js (React) deployed on Vercel.
2. **Backend/ETL:** Python scripts (`pandas`, `spotipy`, `sqlalchemy`) containerized and orchestrated via GitHub Actions.
3. **Database:** Cloud MySQL hosted on Aiven.

## 🚀 Automation (GitHub Actions)
The backend pipeline requires zero manual intervention. A GitHub Action workflow (`.github/workflows/spotify-etl.yml`) spins up a server every 2 hours, injects the secure `.cache` Spotify token, fetches any missing songs, and pushes them to the Aiven database using highly robust `ON DUPLICATE KEY UPDATE` queries to prevent data duplication.

## 👨‍💻 Author
**Gauransh Singh**
* Data Engineer & Full Stack Developer
* 🔗 [Connect with me on LinkedIn](https://www.linkedin.com/in/gauransh-singh-211586294)

---
*Built with ❤️ and a lot of music.*
