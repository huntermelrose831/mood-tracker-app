import { useState } from "react";
import "./MoodDropdown.css";

export default function MoodDropdown() {
    const [mood, setMood] = useState("");

    return (
        <div>
            <label>Mood: </label>
            <select className="dropdown" value={mood} onSelect={(e) => setMood(e.target.value)}>
                <p>Select mood</p>
                <option value="happy"> = Happy</option>
                <option value="sad"> = Sad</option>
                <option value="angry"> = Angry</option>
                <option value="anxious"> = Anxious</option>
                <option value="meh"> = Meh</option>
            </select>
        </div>
    );
}