function createTotalSolvedGraph(usersData) {
    const labels = usersData.map(user => user.name);
    const data = usersData.map(user => user.totalSolved);

    new ApexCharts(document.querySelector("#totalSolvedGraph"), {
        chart: {
            type: 'bar',
            height: 350
        },
        series: [{
            name: 'Total Problems Solved',
            data: data
        }],
        xaxis: {
            categories: labels,
        },
        colors: ['#2CBB5D'],
        legend: {
            show: false
        }
    }).render();
}

function createDifficultyGraph(usersData) {
    const labels = usersData.map(user => user.name);
    const easySolved = usersData.map(user => user.easySolved);
    const mediumSolved = usersData.map(user => user.mediumSolved);
    const hardSolved = usersData.map(user => user.hardSolved);

    new ApexCharts(document.querySelector("#difficultyGraph"), {
        chart: {
            type: 'bar',
            height: 350,
            stacked: false
        },
        series: [
            {
                name: 'Easy Solved',
                data: easySolved
            },
            {
                name: 'Medium Solved',
                data: mediumSolved
            },
            {
                name: 'Hard Solved',
                data: hardSolved
            }
        ],
        xaxis: {
            categories: labels,
        },
        colors: ['#1DBBBA', '#FFB601', '#F63636'],
        legend: {
            position: 'top'
        }
    }).render();
}


function createContestAttendGraph(usersData) {
    const labels = usersData.map(user => user.name);
    const contestAttend = usersData.map(user => user.contestAttend);

    new ApexCharts(document.querySelector("#contestAttendGraph"), {
        chart: {
            type: 'bar',
            height: 350
        },
        series: [{
            name: 'Contests Attended',
            data: contestAttend
        }],
        xaxis: {
            categories: labels,
        },
        colors: ['#36a2eb'],
        legend: {
            show: false
        }
    }).render();
}

function createContestRatingGraph(usersData) {
    const labels = usersData.map(user => user.name);
    const contestRating = usersData.map(user => parseInt(user.contestRating, 10));  // Convert to integers

    new ApexCharts(document.querySelector("#contestRatingGraph"), {
        chart: {
            type: 'line',
            height: 350,
            zoom: {
                enabled: false
            }
        },
        series: [{
            name: 'Contest Rating',
            data: contestRating
        }],
        xaxis: {
            categories: labels,
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return Math.floor(value);  // Ensure Y-axis labels are integers
                }
            }
        },
        colors: ['#ff9f40'],
        legend: {
            position: 'top'
        }
    }).render();
}
function createContestTopPercentageGraph(usersData) {
    const labels = usersData.map(user => user.name);
    const contestTopPercentage = usersData.map(user => user.contestTopPercentage);

    new ApexCharts(document.querySelector("#contestTopPercentageGraph"), {
        chart: {
            type: 'bar',
            height: 350
        },
        series: [{
            name: 'Top Percentage',
            data: contestTopPercentage
        }],
        xaxis: {
            categories: labels,
        },
        yaxis: {
            reversed: true,  // Reverse the y-axis to show lower values at the top
            labels: {
                formatter: function (value) {
                    return Math.round(value);  // Ensure Y-axis labels are integers
                }
            }
        },
        colors: ['#FEA117'],
        legend: {
            position: 'top'
        }
    }).render();
}


function renderGraphs() {
    createTotalSolvedGraph(usersData);
    createDifficultyGraph(usersData);
   
    createContestAttendGraph(usersData);
    createContestRatingGraph(usersData);
    createContestTopPercentageGraph(usersData);
}


let usersData = [];
let userIndex = 4;

// Function to fetch profile data
async function fetchProfileData(profileUrl) {
    const apiUrl = "http://localhost:3000/userProfile"; // Update with your correct API URL
    try {
        const response = await fetch(`${apiUrl}/${encodeURIComponent(profileUrl)}`);
        if (!response.ok) {
            throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        console.log("Fetched profile data:", data);

        if (!data) {
            throw new Error("No profile data found");
        }

        return data;
    } catch (error) {
        console.error("Error fetching profile data:", error);
        throw error;
    }
}

// Function to fetch contest data
async function fetchContestData(profileUrl) {
    const apiUrl = `http://localhost:3000/${encodeURIComponent(profileUrl)}/contest`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch contest data");
        }

        const data = await response.json();
        console.log("Fetched contest data:", data);

        return data;
    } catch (error) {
        console.error("Error fetching contest data:", error);
        throw error;
    }
}

// Function to fetch user name from the profile API
async function fetchUserName(profileUrl) {
    const apiUrl = `http://localhost:3000/${encodeURIComponent(profileUrl)}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch user profile data");
        }

        const data = await response.json();
        console.log("Fetched user name:", data.name);

        if (!data || !data.name) {
            throw new Error("No user name found");
        }

        return data.name;
    } catch (error) {
        console.error("Error fetching user name:", error);
        throw error;
    }
}

// Function to fetch and display both profile and contest data for a specific user
async function fetchUserData(index) {
    const profileUrl = document.getElementById(`profileUrl${index}`).value;

    if (!profileUrl) {
        alert("Please enter a profile URL");
        return;
    }

    try {
        // Fetch user name
        const userName = await fetchUserName(profileUrl);
        // Fetch profile data
        const profileData = await fetchProfileData(profileUrl);
        // Fetch contest data
        const contestData = await fetchContestData(profileUrl);

        // Extract the relevant data to be saved
        const user = {
            name: userName,
            totalSolved: profileData.totalSolved,
            easySolved: profileData.easySolved,
            mediumSolved: profileData.mediumSolved,
            hardSolved: profileData.hardSolved,
            ranking: profileData.ranking,
            contestAttend: contestData.contestAttend,
            contestRating: contestData.contestRating,
            contestGlobalRanking: contestData.contestGlobalRanking,
            contestTopPercentage: contestData.contestTopPercentage
        };

        // Store the relevant data in the usersData array
        usersData.push(user);
    } catch (error) {
        
    }
}

// Function to display the relevant data for a specific user
const animation = lottie.loadAnimation({
    container: document.getElementById('lottieAnimation'), // Container to render the animation
    path: 'loading.json', // Path to loading.json (relative to the server root)
    renderer: 'svg',
    loop: true,
    autoplay: true
});

// Function to add a new user input section dynamically
function addNewUser() {
    userIndex++;

    const newUserContainer = document.createElement('div');
    newUserContainer.classList.add('user-container');
    newUserContainer.id = `user${userIndex}`;

    newUserContainer.innerHTML = `
        <input type="text" id="profileUrl${userIndex}" placeholder="Enter profile URL">
    `;

    document.getElementById('usersContainer').appendChild(newUserContainer);
}

// Function to remove a user input section dynamically
function removeUser() {
    if (userIndex > 2) {  // Ensure there's always at least two user input field
        const userContainer = document.getElementById(`user${userIndex}`);
        userContainer.remove();
        userIndex--;
    } else {
        alert("At least two user profile must remain.");
    }
}

// Function to fetch and display data for all users
async function fetchAllUserData() {
    
    document.getElementById('loading').style.display = 'block';
    const userContainers = document.querySelectorAll('.user-container');


    usersData = []; // Clear the array before refetching
    for (let i = 0; i < userContainers.length; i++) {
        const index = i + 1;
        await fetchUserData(index);
    }
    document.getElementById('loading').style.display = 'none';
    // Generate graphs after fetching all user data
    renderGraphs();
    document.getElementById('graphsSection').style.display = 'block';
}

function resetPage() {
    // Clear all input boxes
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => input.value = '');

    // Hide the graphs section
    document.getElementById('graphsSection').style.display = 'none';
}
// Add event listener to the "+" button outside the user containers
document.getElementById('addUserButton').addEventListener('click', addNewUser);
