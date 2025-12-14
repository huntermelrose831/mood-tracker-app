import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./Stats.css";

export default function Stats({ entries, onClose }) {
  // Refs for each chart canvas element
  const weekdayMoodChartRef = useRef(null);
  const moodPieChartRef = useRef(null);
  const topActivitiesChartRef = useRef(null);

  // Keep track of all chart instances for cleanup
  const activeCharts = useRef({});

  // Cleanup all charts when component unmounts
  useEffect(() => {
    return () => {
      // Destroy all charts to prevent memory leaks
      Object.values(activeCharts.current).forEach((chartInstance) => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      });
    };
  }, []);

  // Create charts whenever entries data changes
  useEffect(() => {
    // Don't create charts if we have no data
    if (!entries || entries.length === 0) return;

    // Clean up existing charts first
    Object.values(activeCharts.current).forEach((chart) => chart?.destroy());
    activeCharts.current = {};

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Chart 1: Average mood by weekday
    if (weekdayMoodChartRef.current) {
      createWeekdayMoodChart(daysOfWeek);
    }

    // Chart 2: Pie chart showing mood distribution
    if (moodPieChartRef.current) {
      createMoodDistributionChart();
    }

    // Chart 3: Top activities horizontal bar chart
    if (topActivitiesChartRef.current) {
      createTopActivitiesChart();
    }
  }, [entries]);

  // Helper function to create the weekday mood chart
  const createWeekdayMoodChart = (weekdays) => {
    const averageMoodPerDay = weekdays.map((dayName) => {
      const entriesForThisDay = entries.filter(
        (entry) => entry.weekday === dayName
      );

      if (entriesForThisDay.length === 0) return 0;

      // Calculate average mood rating for this weekday
      const totalMoodRating = entriesForThisDay.reduce((sum, entry) => {
        return sum + entry.mood_rating;
      }, 0);

      return totalMoodRating / entriesForThisDay.length;
    });

    activeCharts.current.weekdayMood = new Chart(weekdayMoodChartRef.current, {
      type: "bar",
      data: {
        labels: weekdays,
        datasets: [
          {
            label: "Average Mood (1-5)",
            data: averageMoodPerDay,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5, // Mood rating goes from 1-5
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Average Mood by Weekday",
            font: { size: 18 },
          },
        },
      },
    });
  };

  // Helper function to create mood distribution pie chart
  const createMoodDistributionChart = () => {
    // Count occurrences of each mood
    const moodFrequency = entries.reduce((accumulator, entry) => {
      const moodType = entry.mood_category;
      accumulator[moodType] = (accumulator[moodType] || 0) + 1;
      return accumulator;
    }, {});

    const moodLabels = Object.keys(moodFrequency);
    const moodCounts = Object.values(moodFrequency);

    // Colors for each mood type - should match the mood selector colors
    const moodColorMap = {
      excited: "#FFD97B",
      happy: "#CBFF8D",
      neutral: "#EA8CFF",
      sad: "#8CD7FF",
      angry: "#FF8C8C",
      calm: "#8CD7FF", // Using same color as sad for now
    };

    activeCharts.current.moodDistribution = new Chart(moodPieChartRef.current, {
      type: "pie",
      data: {
        labels: moodLabels.map(
          (label) => label.charAt(0).toUpperCase() + label.slice(1) // Capitalize first letter
        ),
        datasets: [
          {
            data: moodCounts,
            backgroundColor: moodLabels.map(
              (mood) => moodColorMap[mood] || "#999"
            ),
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Mood Distribution",
            font: { size: 18 },
          },
          legend: {
            position: "bottom",
          },
        },
      },
    });
  };

  // Helper function to create top activities chart
  const createTopActivitiesChart = () => {
    // Count all activities across all entries
    const activityFrequency = entries.reduce((accumulator, entry) => {
      if (entry.activities && entry.activities.length > 0) {
        entry.activities.forEach((activityName) => {
          accumulator[activityName] = (accumulator[activityName] || 0) + 1;
        });
      }
      return accumulator;
    }, {});

    // Get top 10 most frequent activities
    const sortedActivities = Object.entries(activityFrequency)
      .sort(([, countA], [, countB]) => countB - countA) // Sort by count descending
      .slice(0, 10); // Take only top 10

    activeCharts.current.topActivities = new Chart(
      topActivitiesChartRef.current,
      {
        type: "bar",
        data: {
          labels: sortedActivities.map(([activityName]) => activityName),
          datasets: [
            {
              label: "Count",
              data: sortedActivities.map(([, count]) => count),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y", // Makes it horizontal
          plugins: {
            title: {
              display: true,
              text: "Top 10 Activities",
              font: { size: 18 },
            },
          },
        },
      }
    );
  };

  // Calculate some quick summary stats
  const totalEntries = entries.length;

  const averageMood =
    totalEntries > 0
      ? (
          entries.reduce((sum, entry) => sum + entry.mood_rating, 0) /
          totalEntries
        ).toFixed(1)
      : "N/A";

  const mostCommonMood = totalEntries > 0 ? getMostFrequentMood() : "N/A";

  // Helper to find the most common mood
  function getMostFrequentMood() {
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood_category] = (acc[entry.mood_category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0][0]; // Get the mood with highest count
  }

  return (
    <div className="stats">
      {/* Overlay to close modal when clicking outside */}
      <div className="stats__overlay" onClick={onClose}></div>

      <div className="stats__container">
        <div className="stats__header">
          <h1 className="stats__title">📊 Mood Statistics</h1>
          <button className="stats__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="stats__content">
          {/* Summary cards at the top */}
          <div className="stats__summary">
            <div className="stats__summary-card">
              <h3>Total Entries</h3>
              <p className="stats__summary-value">{totalEntries}</p>
            </div>

            <div className="stats__summary-card">
              <h3>Average Mood</h3>
              <p className="stats__summary-value">{averageMood}</p>
            </div>

            <div className="stats__summary-card">
              <h3>Most Common Mood</h3>
              <p className="stats__summary-value">{mostCommonMood}</p>
            </div>
          </div>

          {/* Chart containers */}
          <div className="stats__chart-container">
            <canvas ref={weekdayMoodChartRef}></canvas>
          </div>

          <div className="stats__chart-container">
            <canvas ref={moodPieChartRef}></canvas>
          </div>

          <div className="stats__chart-container">
            <canvas ref={topActivitiesChartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
