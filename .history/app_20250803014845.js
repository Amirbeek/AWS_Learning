document.addEventListener('DOMContentLoaded', function () {
    const API_ENDPOINT = 'https://ngnkk7xaki.execute-api.us-east-1.amazonaws.com/dev/course';

    const calculatorForm = document.getElementById('calculatorForm');
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const calculateBtn = document.getElementById('calculateBtn');
    const btnText = document.getElementById('btnText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    const resultSection = document.getElementById('resultSection');

    const resultId = document.getElementById('resultId');
    const resultTimestamp = document.getElementById('resultTimestamp');
    const resultNum1 = document.getElementById('resultNum1');
    const resultNum2 = document.getElementById('resultNum2');
    const resultSum = document.getElementById('resultSum');

    calculatorForm.addEventListener('submit', function (event) {
        event.preventDefault();
        errorAlert.classList.add('d-none');
        resultSection.classList.add('d-none');

        const num1 = parseFloat(num1Input.value);
        const num2 = parseFloat(num2Input.value);

        if (isNaN(num1) || isNaN(num2)) {
            showError('Please enter valid numbers');
            return;
        }

        setLoadingState(true);

        const requestData = {
            num1: num1,
            num2: num2
        };

        fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(errData.message || 'Server error');
                    });
                }
                return response.json();
            })
            .then(data => {
                setLoadingState(false);

                if (data.result) {
                    displayResult(data);
                } else {
                    showError('Unexpected API response format');
                }
            })
            .catch(error => {
                setLoadingState(false);
                showError(error.message || 'An error occurred while communicating with the API');
            });
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove('d-none');
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            btnText.textContent = 'Calculating...';
            loadingSpinner.classList.remove('d-none');
            calculateBtn.disabled = true;
        } else {
            btnText.textContent = 'CALCULATE';
            loadingSpinner.classList.add('d-none');
            calculateBtn.disabled = false;
        }
    }

    function displayResult(data) {
        const result = data.result;

        let timestampDisplay = result.Timestamp;
        if (result.Timestamp && !isNaN(result.Timestamp)) {
            const date = new Date(parseInt(result.Timestamp) * 1000);
            timestampDisplay = date.toLocaleString();
        }

        resultId.textContent = result.ID || 'N/A';
        resultTimestamp.textContent = timestampDisplay || 'N/A';
        resultNum1.textContent = result.num1;
        resultNum2.textContent = result.num2;
        resultSum.textContent = result.sum;

        resultSection.classList.remove('d-none');
    }
});
