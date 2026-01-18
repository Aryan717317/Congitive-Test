# 🧠 Cognitive Research Tool

A beautifully designed, scientifically structured web application for measuring **memory recall** and **reaction time** capabilities. Built as a Single Page Application (SPA) with an interactive 3D particle background and modern UI aesthetics.

![Cognitive Research Tool](https://img.shields.io/badge/Cognitive-Research%20Tool-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### 🎯 Two Cognitive Modules

1. **Memory Recall Test**
   - Memorize 10 randomly selected words in 30 seconds
   - Recall as many words as possible
   - Scoring based on correct word matches

2. **Reaction Time Test**
   - 5 trials of reaction time measurement
   - Click target as fast as possible when it appears
   - Random delay intervals to prevent anticipation

### 🎨 Modern UI/UX

- **Interactive 3D Particle Background** - Dynamic, mouse-responsive particles with connection lines
- **Dark/Light Theme Toggle** - Seamless theme switching with system preference detection
- **Smooth Page Transitions** - Hash-based SPA routing with elegant animations
- **Progress Navigation** - Visual progress indicator showing current experiment phase
- **Responsive Design** - Works beautifully on all device sizes

### 📊 Results & Export

- Comprehensive results display with animated progress bars
- Memory accuracy percentage
- Average reaction time with individual trial breakdown
- **Export to JSON** - Download complete experiment data for analysis

## 🚀 Getting Started

### Quick Start

Simply open `index.html` in any modern web browser - no server required!

```bash
# Clone the repository
git clone https://github.com/Aryan717317/Congitive-Test.git

# Navigate to the directory
cd Congitive-Test

# Open in browser (or just double-click index.html)
start index.html  # Windows
open index.html   # macOS
```

### File Structure

```
cognitive-research-tool/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling with themes
├── app.js          # SPA logic and experiment functionality
└── README.md       # This file
```

## 🎮 How to Use

1. **Enter Participant ID** - Provide a unique identifier for data tracking
2. **Memory Study Phase** - Study 10 words displayed for 30 seconds
3. **Recall Phase** - Type all words you can remember
4. **Reaction Test** - Click the green circle as quickly as possible (5 trials)
5. **Results** - View your performance and export data

## 🛠️ Technical Highlights

- **Pure Vanilla JavaScript** - No external dependencies required
- **Hash-Based Routing** - SPA navigation using `window.location.hash`
- **CSS Custom Properties** - Dynamic theming with CSS variables
- **Canvas API** - Smooth 60fps particle animations
- **Local Storage** - Theme preference persistence
- **Performance.now()** - High-precision reaction time measurement

## 🎨 Customization

### Modify Word Pool

Edit the `wordPool` array in `app.js` to customize memorization words:

```javascript
wordPool: [
    'Apple', 'Clock', 'River', 'Mountain', 'Garden',
    // Add more words...
]
```

### Adjust Timings

- Study duration: Modify `startStudyTimer(30)` parameter
- Reaction delay: Adjust `getRandomDelay(1500, 4000)`
- Feedback duration: Change the timeout in `showFeedbackAndContinue()`

## 📈 Data Export Format

Exported JSON includes:

```json
{
  "participantId": "string",
  "timestamp": "ISO-8601 datetime",
  "memoryRecall": {
    "stimuliWords": ["array of presented words"],
    "recalledWords": ["array of recalled words"],
    "correctCount": "number",
    "accuracy": "percentage"
  },
  "responseTime": {
    "trials": [{"trial": 1, "responseTimeMs": 250}],
    "averageMs": "number"
  }
}
```

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

<p align="center">
  Made with ❤️ for cognitive science research
</p>
