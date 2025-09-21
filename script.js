document.addEventListener('DOMContentLoaded', () => {
    const subjectsContainer = document.getElementById('subjects-container');
    const addSubjectBtn = document.getElementById('add-subject');
    const calculateGwaBtn = document.getElementById('calculate-gwa');
    const gwaDisplay = document.getElementById('gwa-display');
    const statusDisplay = document.getElementById('status-display');
    
    // The first row is already in the HTML. Now we handle adding more.
    addSubjectBtn.addEventListener('click', addSubjectRow);
    calculateGwaBtn.addEventListener('click', calculateGWA);

    function addSubjectRow() {
        const subjectRow = document.createElement('div');
        subjectRow.className = 'subject-row';
        subjectRow.innerHTML = `
            <div class="input-group">
                <label>Subject Name:</label>
                <input type="text" class="subject-name-input" placeholder="e.g., ENG 101">
            </div>
            <div class="input-group">
                <label>Grade:</label>
                <input type="number" class="grade-input" placeholder="1.00 - 5.00" step="0.01" min="1.00" max="5.00">
            </div>
            <div class="input-group">
                <label>Units:</label>
                <input type="number" class="units-input" placeholder="e.g., 3" step="0.5" min="1">
            </div>
            <button class="remove-btn">Remove</button>
        `;
        subjectsContainer.appendChild(subjectRow);

        // Add event listener to the new remove button
        subjectRow.querySelector('.remove-btn').addEventListener('click', () => {
            subjectsContainer.removeChild(subjectRow);
        });
    }

    function calculateGWA() {
        let totalWeightedGrades = 0;
        let totalUnits = 0;
        let hasFailedSubject = false;
        let hasInvalidInput = false;

        const subjectRows = document.querySelectorAll('.subject-row');

        if (subjectRows.length === 0) {
            gwaDisplay.textContent = 'Please add at least one subject.';
            statusDisplay.textContent = '';
            gwaDisplay.className = '';
            return;
        }

        subjectRows.forEach(row => {
            const gradeInput = row.querySelector('.grade-input');
            const unitsInput = row.querySelector('.units-input');

            const grade = parseFloat(gradeInput.value);
            const units = parseFloat(unitsInput.value);

            // Validation
            if (isNaN(grade) || isNaN(units) || grade < 1 || grade > 5 || units <= 0) {
                hasInvalidInput = true;
                return; // Skip this row if input is invalid
            }

            // Check for a failing grade of 5.00
            if (grade === 5.00) {
                hasFailedSubject = true;
            }

            totalWeightedGrades += grade * units;
            totalUnits += units;
        });

        // If any input was invalid, stop and show error
        if (hasInvalidInput) {
            gwaDisplay.textContent = 'Invalid Input. Please enter valid grades and units (1.00-5.00).';
            statusDisplay.textContent = '';
            gwaDisplay.className = 'failed';
            return;
        }

        if (totalUnits === 0) {
            gwaDisplay.textContent = 'Please add units to your subjects.';
            statusDisplay.textContent = '';
            gwaDisplay.className = '';
            return;
        }
        
        const gwa = totalWeightedGrades / totalUnits;
        const roundedGwa = gwa.toFixed(2);

        // Display results
        gwaDisplay.textContent = `GWA: ${roundedGwa}`;

        // Determine academic status
        if (hasFailedSubject || roundedGwa > 3.00) {
            statusDisplay.textContent = "FAILED";
            statusDisplay.className = 'failed';
        } else if (roundedGwa <= 1.75) {
            statusDisplay.textContent = "DEAN'S LISTER! 🎉";
            statusDisplay.className = 'deans-lister';
        } else {
            statusDisplay.textContent = "PASSED";
            statusDisplay.className = 'passed';
        }
    }
});