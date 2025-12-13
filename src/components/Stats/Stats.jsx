/**
 * Stats Component
 *
 * Modal overlay displaying mood analytics using Chart.js visualizations.
 *
 * Features:
 * - 3 interactive charts:
 *   1. Average Mood by Weekday (Bar Chart)
 *   2. Mood Distribution (Pie Chart)
 *   3. Top 10 Activities (Horizontal Bar Chart)
 * - 3 summary statistic cards:
 *   - Total Entries count
 *   - Average Mood rating (1-5 scale)
 *   - Most Common Mood category
 * - Scrollable overlay with close button
 * - Automatic chart cleanup on unmount to prevent memory leaks
 *
 * Props:
 * @param {Array} entries - Array of mood entry objects from App.jsx
 * @param {Function} onClose - Callback to close the modal
 */

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./Stats.css";

export default function Stats({ entries, onClose }) {
  // Refs for canvas elements where charts will be rendered
  const moodByWeekdayRef = useRef(null);
  const moodDistributionRef = useRef(null);
  const activitiesByMoodRef = useRef(null);
  // Ref to store Chart.js instances for cleanup
  const chartsRef = useRef({});

  /**
   * Cleanup Effect
   *
   * Destroys all Chart.js instances when component unmounts.
   * This prevents memory leaks and canvas rendering errors.
   */
  useEffect(() => {
    // Return cleanup function
    return () => {
      Object.values(chartsRef.current).forEach((chart) => chart?.destroy());
    };
  }, []);

  /**
   * Chart Rendering Effect
   *
   * Creates all three charts when entries data is available.
   * Destroys and recreates charts if entries change.
   */
  useEffect(() => {
    // Don't render if no data available
    if (!entries || entries.length === 0) return;

    // Destroy any existing charts before creating new ones
    Object.values(chartsRef.current).forEach((chart) => chart?.destroy());
    chartsRef.current = {};

    // Weekday order for consistent x-axis labels
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    /**
     * CHART 1: Average Mood by Weekday (Bar Chart)
     *
     * Shows the average mood rating (1-5 scale) for each day of the week.
     * Helps identify if certain weekdays tend to have better/worse moods.
     */
    if (moodByWeekdayRef.current) {
      // Calculate average mood for each weekday
      const avgMoodData = weekdays.map((wd) => {
        const wdEntries = entries.filter((e) => e.weekday === wd);
        if (wdEntries.length === 0) return 0;
        return (
          wdEntries.reduce((sum, e) => sum + e.mood_rating, 0) /
          wdEntries.length
        );
      });

      // Create and store the bar chart
      chartsRef.current.moodByWeekday = new Chart(moodByWeekdayRef.current, {
        type: "bar",
        data: {
          labels: weekdays,
          datasets: [
            {
              label: "Average Mood (1-5)",
              data: avgMoodData,
              backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue bars
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
              max: 5, // Mood scale is 1-5
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
    }

    /**
     * CHART 2: Mood Distribution (Pie Chart)
     *
     * Shows the percentage breakdown of each mood category.
     * Visualizes which moods are most/least common overall.
     */
    if (moodDistributionRef.current) {
      // Count occurrences of each mood category
      const moodCounts = entries.reduce((acc, e) => {
        const mood = e.mood_category;
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(moodCounts);
      const values = Object.values(moodCounts);

      // Color mapping for each mood category (matches card colors)
      const colors = {
        excited: "#FFD97B",
        happy: "#CBFF8D",
        neutral: "#EA8CFF",
        sad: "#8CD7FF",
        angry: "#FF8C8C",
        calm: "#8CD7FF",
      };

      // Create and store the pie chart
      chartsRef.current.moodDistribution = new Chart(
        moodDistributionRef.current,
        {
          type: "pie",
          data: {
            labels: labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1)), // Capitalize labels
            datasets: [
              {
                data: values,
                backgroundColor: labels.map((l) => colors[l] || "#999"), // Map mood to color
                borderWidth: 2,
                borderColor: "#fff", // White borders between slices
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
                position: "bottom", // Legend below chart
              },
            },
          },
        }
      );
    }

    /**
     * CHART 3: Top 10 Activities (Horizontal Bar Chart)
     *
     * Shows the most frequently logged activities across all mood entries.
     * Helps identify which activities are most common in daily life.
     */
    if (activitiesByMoodRef.current) {
      // Count occurrences of each activity
      const activityCounts = entries.reduce((acc, e) => {
        if (e.activities && e.activities.length > 0) {
          e.activities.forEach((activity) => {
            acc[activity] = (acc[activity] || 0) + 1;
          });
        }
        return acc;
      }, {});

      // Sort activities by count descending and take top 10
      const topActivities = Object.entries(activityCounts)
        .sort(([, a], [, b]) => b - a) // Sort by count (highest first)
        .slice(0, 10); // Limit to top 10

      // Create and store the horizontal bar chart
      chartsRef.current.activitiesByMood = new Chart(
        activitiesByMoodRef.current,
        {
          type: "bar",
          data: {
            labels: topActivities.map(([activity]) => activity), // Activity names
            datasets: [
              {
                label: "Count",
                data: topActivities.map(([, count]) => count), // Frequency counts
                backgroundColor: "rgba(75, 192, 192, 0.6)", // Teal bars
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y", // Horizontal bars (y-axis shows labels)
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
    }
  }, [entries]); // Re-render charts when entries data changes

  /**
   * Component Structure:
   *
   * stats (container)
   * ├── stats__overlay (dark background, closes modal on click)
   * └── stats__container (white modal box)
   *     ├── stats__header (title + close button)
   *     ├── stats__summary (3 statistic cards)
   *     │   ├── Total Entries
   *     │   ├── Average Mood
   *     │   └── Most Common Mood
   *     └── stats__content (scrollable charts area)
   *         ├── Chart 1: Avg Mood by Weekday
   *         ├── Chart 2: Mood Distribution
   *         └── Chart 3: Top 10 Activities
   */
  return (
    <div className="stats">
      {/* Dark overlay background - click to close modal */}
      <div className="stats__overlay" onClick={onClose}></div>

      {/* Main modal container */}
      <div className="stats__container">
        {/* Header with title and close button */}
        <div className="stats__header">
          <h1 className="stats__title">📊 Mood Statistics</h1>
          <button className="stats__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="stats__content">
          {/* Summary statistics cards */}
          <div className="stats__summary">
            {/* Card 1: Total number of mood entries */}
            <div className="stats__summary-card">
              <h3>Total Entries</h3>
              <p className="stats__summary-value">{entries.length}</p>
            </div>

            {/* Card 2: Average mood rating (1-5 scale) */}
            <div className="stats__summary-card">
              <h3>Average Mood</h3>
              <p className="stats__summary-value">
                {entries.length > 0
                  ? (
                      entries.reduce((sum, e) => sum + e.mood_rating, 0) /
                      entries.length
                    ).toFixed(1)
                  : "N/A"}
              </p>
            </div>

            {/* Card 3: Most frequently occurring mood category */}
            <div className="stats__summary-card">
              <h3>Most Common Mood</h3>
              <p className="stats__summary-value">
                {entries.length > 0
                  ? Object.entries(
                      entries.reduce((acc, e) => {
                        acc[e.mood_category] = (acc[e.mood_category] || 0) + 1;
                        return acc;
                      }, {})
                    ).sort(([, a], [, b]) => b - a)[0][0]
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Chart 1: Average mood by weekday (bar chart) */}
          <div className="stats__chart-container">
            <canvas ref={moodByWeekdayRef}></canvas>
          </div>

          {/* Chart 2: Mood distribution (pie chart) */}
          <div className="stats__chart-container">
            <canvas ref={moodDistributionRef}></canvas>
          </div>

          {/* Chart 3: Top 10 activities (horizontal bar chart) */}
          <div className="stats__chart-container">
            <canvas ref={activitiesByMoodRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
