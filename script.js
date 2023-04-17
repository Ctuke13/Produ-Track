window.addEventListener('load', () => {
  /*-----------------LOG IN-----------------*/

  const signUpLink = document.getElementById('sign-up-link');
  const signUpSubmit = document.getElementById('sign-up-submit');
  const signUpModal = document.querySelector('.sign-up-modal');

  signUpLink.addEventListener('click', () => {
    signUpModal.removeAttribute('hidden');
  });

  const users = [];

  signUpSubmit.addEventListener('click', () => {
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('sign-up-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!firstName || !lastName || !dob || !email || !password || !confirmPassword) {
      alert('Please fill out all fields');
      return;
    } else if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    } else if (users.find(user => user.email === email)) {
      alert('Email already exists');
      return;
    } else { 
      users.push({
        firstName,
        lastName,
        dob,
        email,
        password
      });

      localStorage.setItem('user', JSON.stringify(users));
      signUpModal.setAttribute('hidden', true);
    }
  });

  const logInSubmit = document.getElementById('log-in-btn');

  logInSubmit.addEventListener('click', () => {
    const email = document.getElementById('log-in-email').value;
    const password = document.getElementById('log-in-password').value;

    if (!email || !password) {
      alert('Please fill out all fields');
      return;
    } else if (!users.find(user => user.email === email)) {
      alert('Email does not exist');
      return;
    } else if (users.find(user => user.email === email && user.password !== password)) {
      alert('Incorrect password');
      return;
    } else {
      localStorage.setItem('currentUser', email);
      window.location.href = 'home.html';
    }
  }); 

  /*-----------------HOME-----------------*/

  const savedUsers = JSON.parse(localStorage.getItem('user'));
  console.log(savedUsers);


  /*------CALENDAR----------*/

    let nav = 0; // How we keep track of what month we're on
    let clicked = null;
    let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

    const calendar = document.getElementById('calendar');
    const newEventModal = document.getElementById('newEventModal');
    const dayEventModal = document.getElementById('dayEventModal');
    const backDrop = document.getElementById('modalBackDrop');
    const eventInput= document.getElementById('eventInput');
    const dayTitle = document.querySelector('.eventTitle');
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const exerciseData = Object.values(localStorage).map(data => JSON.parse(data)).filter(data => data.exercise);
    console.log(exerciseData);

    function openModal(date) {
      const day = document.createElement('h2');
      day.id = 'dayTitle';
      day.innerText = date;
      dayEventModal.appendChild(day);
      clicked = date;
      dayTitle.innerText = date;
      

      console.log(dayTitle.innerText);
      console.log(events);
      

      const closeButton = document.createElement('button');
      closeButton.id = 'closeButton';
      closeButton.innerText = 'Close';
      
      closeButton.addEventListener('click', function() {
        closeModal();
      });
      dayEventModal.appendChild(closeButton);

      const exerciseForDay = exerciseData.filter(e => {
        const formattedDate = new Date(e.date).toLocaleDateString('en-US', {
          month:'numeric',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short'
        });

        const clickedDate = new Date(clicked).toLocaleString('en-US', {
          month:'numeric',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short'
        });
        
        console.log(dayTitle.innerText)
        return formattedDate === clickedDate;
      });
        console.log(exerciseForDay);
    

          if(clicked) {
            dayEventModal.style.display = 'block';
          } else {
            newEventModal.style.display = 'block';
            backDrop.style.display = 'block';
          }

      console.log(exerciseForDay);
      console.log(exerciseForDay[0].exercise)

      if (exerciseForDay) {
        for (const [index, value] of exerciseForDay.entries()) {
          const exerciseOfDay = document.createElement('p');
          exerciseOfDay.id = 'workoutText';
          exerciseOfDay.contentEditable = false;
          exerciseOfDay.innerText = exerciseForDay[index].exercise;
          const setsHeading = document.createElement('h3');
          setsHeading.innerText = "Sets:";
          const sets = document.createElement('input');
          sets.id = "sets_for_day";
          sets.readOnly = true;
          exerciseOfDay.appendChild(setsHeading);
          setsHeading.id = "setsHeading";
          setsHeading.appendChild(sets);
          sets.value = ` ${exerciseForDay[index].sets}`;

          
          for(const key in exerciseForDay[index]) {
            if (key.startsWith('rep_')) {
          const repKey = exerciseForDay[index][key];  
          const repsHeading = document.createElement('h3');
          repsHeading.innerText = `Rep ${key.slice(4)}:`;
          const reps = document.createElement('input');
          reps.id = "reps_for_day";
          reps.readOnly = true;
          exerciseOfDay.appendChild(repsHeading);
          repsHeading.id = "repsHeading";
          repsHeading.appendChild(reps);
          reps.value = repKey;
}

          if (key.startsWith('weight_')) {
            const weightKey = exerciseForDay[index][key];  
            const weightHeading = document.createElement('h3');
            weightHeading.innerText = 'Weight:';
            const weight = document.createElement('input');
            weight.id = "weight_for_day";
            weight.readOnly = true;
            exerciseOfDay.appendChild(weightHeading);
            weightHeading.id = "weightHeading";
            weightHeading.appendChild(weight);
            weight.value = weightKey;
}
          };
          dayEventModal.appendChild(exerciseOfDay);
          const editButton = document.createElement('button');
          editButton.id = "editButton";
          editButton.innerText = "Edit";
          exerciseOfDay.insertAdjacentElement("afterend", editButton);

      let isEditable = false;

      editButton.addEventListener('click', function() { 
            const setsInput = exerciseOfDay.querySelector('#sets_for_day');
            const repsInputs = exerciseOfDay.querySelectorAll('[id^=reps_for_day]');
            const weightInputs = exerciseOfDay.querySelectorAll('[id^=weight_for_day]');
            const workoutText = document.querySelectorAll('[id^=workoutText]');

          if (!isEditable) {
          setsInput.readOnly = false;
          for (let i = 0; i < repsInputs.length; i++) {
            repsInputs[i].readOnly = false;
            repsInputs[i].style.borderColor = "red";
            
          }
          for (let i = 0; i < weightInputs.length; i++) {
            weightInputs[i].readOnly = false;
            weightInputs[i].style.borderColor = "red";
          }
          editButton.innerText = "Save";
          
        } else {
              setsInput.readOnly = true;
              for (let i = 0; i < repsInputs.length; i++) {
                repsInputs[i].readOnly = true;
                repsInputs[i].style.borderColor = "var(--darkest)";
              }
              for (let i = 0; i < weightInputs.length; i++) {
                weightInputs[i].readOnly = true;
                weightInputs[i].style.borderColor = "var(--darkest)";
              }
              editButton.innerText = "Edit";
              workoutText[i].contentEditable = false;
              workoutText[i].style.borderColor = "var(--darkest)";
            }
            isEditable = !isEditable;
      });

          const deleteButton = document.createElement('button');
          deleteButton.id = "deleteButton";
          deleteButton.innerText = "Delete";
          editButton.insertAdjacentElement("afterend", deleteButton);
          deleteButton.addEventListener('click', function() {
            const confirmDelete = confirm('Are you sure you want to delete this workout?');
            if (confirmDelete) {
              const workout = deleteButton.previousElementSibling.previousElementSibling;
              const exerciseText = workout.childNodes[0].textContent.trim();

              if(exerciseText === exerciseForDay[index].exercise) {
                workout.remove();
                deleteButton.remove();
                editButton.remove();
                localStorage.removeItem(exerciseText);
                         
              }
            }
            location.reload();
    });
        }
      }
    };


    const form = document.querySelector("#task-form");
    const input =  document.querySelector(".to-do");
    const list_el = document.querySelector(".tasks");
    let task_el;

    function load() {
      const dt = new Date();

      if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav)
      }

      const day = dt.getDate();
      const month = dt.getMonth();
      const year = dt.getFullYear();

      const firstDayOfMonth = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year:"numeric",
        month:"numeric",
        day:"numeric",
      });
      
      const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
    
      document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString('en-us', {
        month: "long"
      })} ${year}`;

      calendar.innerHTML = ''


      for(let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add(`day`);

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        if(i > paddingDays) {
          daySquare.innerText = i - paddingDays;
          const eventForDay = events.find(e => e.date === dayString);

          if (i - paddingDays === day && nav === 0) {
            daySquare.id = 'currentDay'
          }

          exerciseData.forEach(exercise => {
            const exerciseDate = new Date(exercise.date);
            if (exerciseDate.getFullYear() === year && exerciseDate.getMonth() === month && exerciseDate.getDate() === i - paddingDays) {
              const workout = document.createElement('div');
              workout.classList.add('workout_event');
              workout.innerText = exercise.exercise;
              daySquare.appendChild(workout);
            }
          });

          if (eventForDay) {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.innerText = eventForDay.title;
            daySquare.appendChild(eventDiv);
          }

          daySquare.addEventListener('click', () => openModal(dayString));
        } else {
          daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);
      }
    };

    function closeModal(){
      eventInput.classList.add('error');
      newEventModal.style.display = 'none';
      dayEventModal.style.display = 'none';
      backDrop.style.display = 'none';
      eventInput.value = '';
      dayEventModal.innerHTML = '';
      clicked = null;
      load();
    };

    function saveEvent() {
      if (eventInput.value) {
        eventInput.classList.remove('error');
        events.push({
          date:clicked,
          title: eventInput.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
      } else {
        eventInput.classList.add('error');
      }
    };

    function deleteEvent(index) {
      exerciseData.splice(index, 1);
      localStorage.setItem('exercise', JSON.stringify(exerciseData));
      closeModal();
    };

    function editEvent(index) {
      const exerciseText = document.getElementById('workoutText');
      const updateExercise = prompt('Enter the updated exercise:');
      exerciseData[index].exercise = updateExercise;
      // exerciseText.innerText = updatedExercise;
      localStorage.setItem('exercise', JSON.stringify(exerciseData));
    }

    function initButtons() {
      document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
      });

      document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
      });

      document.getElementById('saveButton').addEventListener('click', saveEvent);

      document.getElementById('cancelButton').addEventListener('click', closeModal);
      
      // document.getElementById('deleteButton').addEventListener('click', deleteEvent);
      // document.getElementById('closeButton').addEventListener('click', closeModal);
    }

    if (location.pathname === '/home.html') {
    initButtons();
    load();
    

    form.addEventListener('submit', (e) =>{
        e.preventDefault();

        const task = input.value;

        if (!task) {
            alert("Please fill out the task");
        return;
    }
        task_el = document.createElement("div");
        task_el.classList.add("task");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");
        // task_content_el.innerText = task;

        task_el.appendChild(task_content_el);

        const date_input_el = document.querySelector('.date');
        const date_el = document.createElement('h4');
        date_el.setAttribute('id','date-input')
       
        // Retrive the date value from the input element
        const date_value = date_input_el.value;
        if(!date_value) {
          alert("Please select date")
          return;
        };

        // Parse the date value inot a Date object
        const date_obj = new Date(date_value);

        // Get the user's preferred lanuage and country
        const user_locale = navigator.language || 'en-US';

        // Format the date using the user's locale
        const formatted_date = date_obj.toLocaleDateString( user_locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })

        
        // Set content of the h4 element to the formatted date
        date_el.textContent = formatted_date;
        task_content_el.appendChild(date_el);

        if(task && date_value) {
        const task_h = document.querySelector("h3");
        task_h.removeAttribute("hidden")
        }

        const task_p_el = document.createElement("p");
        task_p_el.classList.add("text");
        task_p_el.contentEditable = false;
        task_p_el.type = "text";
        task_p_el.innerText = task;
        task_p_el.setAttribute("readonly", "readonly");

        task_content_el.appendChild(task_p_el);

        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");

        const edit_task = document.createElement("button");
        edit_task.classList.add("edit");
        edit_task.innerText = "edit"

        const delete_task = document.createElement("button");
        delete_task.classList.add("delete");
        delete_task.innerText = "delete"

        task_actions_el.appendChild(edit_task);
        task_actions_el.appendChild(delete_task);

        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        input.value = "";
    });

        list_el.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit')) { 
              const todo = e.target.closest(".task");
              const paragraph = todo.querySelector(".text");
              if (paragraph.tagName === "P") {
                if (paragraph.contentEditable === "false") {
                  paragraph.contentEditable = true;
                  e.target.textContent = "Save";
                  if (document.activeElement !== paragraph) {
                    paragraph.focus();
                  }
                  const range = document.createRange();
                  range.selectNodeContents(paragraph);
                  range.collapse(false);
                  const selection = window.getSelection();
                  selection.removeAllRanges();
                  selection.addRange(range);
                } else {
                  paragraph.contentEditable = false;
                  e.target.textContent = "Edit";
                }
              }
              console.log(paragraph.contentEditable)
            } 
            
            if(e.target.classList.contains('delete')) {
              const del_task = e.target.closest(".task");
            list_el.removeChild(del_task);
        }
    });

    
    const dropdown = document.getElementById("workoutsDropdown");
    const workoutFreq = document.querySelector('.workout-frequency')
    const workoutContainer = document.querySelector('.workout-container')
    const drpdwnBtn = document.querySelector(".dropbtn");
    const workoutData = document.querySelector(".workout-data")
    const exerciseInput = document.querySelector(".exercise-input")

    let optionSelected = false;
    let setsCreated = false;
    let cardioInputsCreated = false;
    let roundsCreated = false;
    let time_el, distance_el, reps_el, weight_el;

    const exerciseSubmit = document.querySelector(".exercise-submit");
    const workoutDate = document.querySelector(".workout_date");
    const workoutDate_el = document.createElement('div');
    workoutDate_el.setAttribute('id','workout-date-input');
    
  
    const addExercise = document.querySelector(".exercise-submit")
    const exercise_el = document.querySelector(".add-exercise")

    exerciseSubmit.setAttribute("hidden", "");
    workoutDate.setAttribute("hidden", "");
    
    dropdown.addEventListener('click', (e) => {
      e.preventDefault();
      drpdwnBtn.innerText = e.target.textContent;
      workoutDate.removeAttribute("hidden");

        if(e.target.textContent == "Weight Training 🏋️" || e.target.textContent == "Calisthenics 💪") {
          // hide other exercise inputs
          if (cardioInputsCreated) {
            exercise_el.removeChild(time_el);
            exercise_el.removeChild(distance_el);
            cardioInputsCreated = false;
          }

          if (roundsCreated) {
            exercise_el.removeChild(rounds_el);
            roundsCreated = false;
          }

          console.log(drpdwnBtn)
          // create sets input
          if (!setsCreated) {
          const sets_el = document.createElement("input");
          sets_el.type = "number";
          sets_el.name = "sets";
          sets_el.classList.add("sets_input");
          sets_el.placeholder = "Sets";
          sets_el.min = 0;
          exercise_el.appendChild(sets_el);
          setsCreated = true;
          
        }
          optionSelected = true;

        } else if(e.target.textContent == "Cardio 🏃") {
          // hide sets input
          if(setsCreated) {
            const setsEl = document.querySelector(".sets_input");
            exercise_el.removeChild(setsEl);
            setsCreated = false;
          }

          if(roundsCreated) {
            exercise_el.removeChild(rounds_el);
            boxingInputsCreated = false;
          }

          // create cardio inputs
          if(!cardioInputsCreated) {
            time_el = document.createElement("input");
            time_el.type = "number";
            time_el.name = "time";
            time_el.classList.add("time_input");
            time_el.placeholder = "Time (min)";
            time_el.min = 0;
            exercise_el.appendChild(time_el);
        
            distance_el = document.createElement("input");
            distance_el.type = "text";
            distance_el.name = "distance";
            distance_el.classList.add("distance_input");
            distance_el.placeholder = "Distance (mi)";
            exercise_el.appendChild(distance_el);

            exercise_el.appendChild(exerciseSubmit);
            cardioInputsCreated = true;
        }

        optionSelected = true;

      } else if(e.target.textContent == "Boxing 🥊") {
          // hide other exercise inputs
          if (cardioInputsCreated) {
            exercise_el.removeChild(time_el);
            exercise_el.removeChild(distance_el);
            cardioInputsCreated = false;
          }

          if(setsCreated) {
            const setsEl = document.querySelector(".sets_input");
            exercise_el.removeChild(setsEl);
            setsCreated = false;
          }

          if(!roundsCreated) {
            rounds_el = document.createElement("input");
            rounds_el.type = "number";
            rounds_el.name = "rounds";
            rounds_el.classList.add("rounds_input");
            rounds_el.placeholder = "Rounds";
            rounds_el.min = 0;
            exercise_el.appendChild(rounds_el);
            roundsCreated = true;
          }

          optionSelected = true;
          
        } else {
        optionSelected = false;
      };

      if (optionSelected) {
        exerciseSubmit.removeAttribute("hidden");
      } else {
        exerciseSubmit.setAttribute("hidden", "");
      }
      });

      const addRepsBtn = document.querySelector('.reps_weight_btn');
      addRepsBtn.setAttribute("hidden", "");
      
      const addRoundsBtn = document.querySelector('.rounds_btn');
      addRoundsBtn.setAttribute("hidden", "");

      const addCardioBtn = document.querySelector('.time_distance_btn');
      addRepsBtn.setAttribute("hidden", "");
      
      let exerciseObject = {};
      let storageKeys = Object.keys(localStorage); 
      console.log(storageKeys);
      const  exerciseDataContainer = document.createElement('h3');

      function updateExerciseObject(storageKeys, exerciseObject) {
        const formattedExercise = exerciseObject.exercise.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const regex = new RegExp(`^${formattedExercise}(\\s+\\d+)?|${formattedExercise}$`, 'i');
        const matchingKeys = storageKeys.filter(key => regex.test(key.toLowerCase()));
        let nextNumber = 1;

        console.log(matchingKeys);

        if (matchingKeys.length === 1) {
          const match = matchingKeys[0].match(/\d+$/);
          console.log(match);
          if (match) {
            nextNumber = parseInt(match[0]) + 1;
            console.log(match)
          } else {
            nextNumber = 2;
            console.log(match);
          }
          exerciseObject.exercise = `${formattedExercise} ${nextNumber}`;
        } else if (matchingKeys.length > 1) {
          const matchingNumbers = matchingKeys.map(key => {
            const match = key.match(/\d+$/);
            return match ? parseInt(match[0]) : 0;
          });
          nextNumber = Math.max(...matchingNumbers) + 1;
          exerciseObject.exercise = `${formattedExercise} ${nextNumber}`;
        } else {
          exerciseObject.exercise = `${formattedExercise}`;
        }
      };

      addExercise.addEventListener('click', (e) => {
        const sets = document.querySelector('.sets_input');
        const rounds = document.querySelector('.rounds_input');
        const time = document.querySelector('.time_input');
        const distance = document.querySelector('distance_input');


        
        exerciseDataContainer.classList.add('exercise_data');

        const workoutName = document.createElement('div')
        workoutName.classList.add('workout_name')
        exerciseDataContainer.appendChild(workoutName);
        workoutName.innerText = exerciseInput.value;
        workoutContainer.appendChild(exerciseDataContainer);

        const exercise_value = exerciseInput.value;
        if(!exercise_value) {
          alert("Please enter an exercise")
          return;
        };

        const workoutDate_value = workoutDate.value;
        if(!workoutDate_value) {
          alert("Please select date")
          return;
        };

        if(!exercise_value || !workoutDate_value) {
          alert("Please enter exercise name and date")
          return;
        } else if(!exercise_value) {
          alert("Please enter exercise name")
          return;
        } else if(!workoutDate_value) {
          alert("Please enter date")
          return;
        } else {


        // Parse the date value into a Date object
        const workoutDate_obj = new Date(`${workoutDate_value}T00:00:00.000`);
        workoutDate_obj.setMinutes(workoutDate_obj.getMinutes() + workoutDate_obj.getTimezoneOffset());

        // Get the user's preferred lanuage and country
        const user_locale = navigator.language || 'en-US';

        // Format the date using the user's locale
        const formatted_date = workoutDate_obj.toLocaleDateString( user_locale, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })

        
        // Set content of the h4 element to the formatted date
        workoutDate_el.textContent = formatted_date;
        exerciseDataContainer.appendChild(workoutDate_el);

        const date = workoutDate_obj.getDate();
        console.log(date);

        if(drpdwnBtn.innerText == "Weight Training 🏋️" || drpdwnBtn.innerText == "Calisthenics 💪") {
          for(let i = 0; i < sets.value; i++) {
          set_number = document.createElement('div');
          set_number.classList.add('set_number');
          set_number.innerText = `Set ${i + 1}`;
          exerciseDataContainer.appendChild(set_number);

          reps_el = document.createElement("input");
          reps_el.type = "text"
          reps_el.name = `rep_${i +1}`
          reps_el.classList.add("reps_input");
          reps_el.id = `rep_${i + 1}`
          reps_el.placeholder = `Reps`;
          exerciseDataContainer.appendChild(reps_el);

          weight_el = document.createElement("input");
          weight_el.type = "text"
          weight_el.name = `weight_${i + 1}`
          weight_el.classList.add("weight_input");
          weight_el.id = `weight_${i + 1}`
          weight_el.placeholder = "Weight (lbs)";
          exerciseDataContainer.appendChild(weight_el);

          exerciseDataContainer.appendChild(addRepsBtn)
          addRepsBtn.removeAttribute("hidden");

          if(exerciseDataContainer.children.length > 0) {
            const lastElement = exerciseDataContainer.children[exerciseDataContainer.children.length - 2];
              lastElement.style.marginBottom = "0px";
            } 
    
          exerciseInput.value = " ";

          exerciseObject.exercise = workoutName.innerText;
          exerciseObject.date = formatted_date;
          exerciseObject.sets = sets.value;
          exerciseObject.type = drpdwnBtn.innerText;
          console.log(exerciseObject.exercise);

          updateExerciseObject(storageKeys, exerciseObject);

          console.log(exerciseObject);
        }

      }else if(drpdwnBtn.innerText == "Boxing 🥊") {
        for(let i = 0; i < rounds.value; i++) {
          round_number = document.createElement('div');
          round_number.classList.add('round_number');
          round_number.innerText = `Round ${i + 1}`;
          exerciseDataContainer.appendChild(round_number);

          mins_el = document.createElement("input");
          mins_el.type = "number"
          mins_el.name = `mins_${i + 1}`
          mins_el.classList.add("mins_input");
          mins_el.id = `mins_${i + 1}`
          mins_el.placeholder = "Minutes";
          exerciseDataContainer.appendChild(mins_el);

          exerciseDataContainer.appendChild(addRoundsBtn)
          addRoundsBtn.removeAttribute("hidden");

          if(exerciseDataContainer.children.length > 0) {
            const lastElement = exerciseDataContainer.children[exerciseDataContainer.children.length - 2];
              lastElement.style.marginBottom = "0px";
            } 
    
          exerciseInput.value = " ";

          exerciseObject.exercise = workoutName.innerText;
          exerciseObject.date = formatted_date;
          exerciseObject.rounds = rounds.value;
          exerciseObject.type = drpdwnBtn.innerText;
          console.log(exerciseObject.exercise);

          updateExerciseObject(storageKeys, exerciseObject);

          console.log(exerciseObject);
        }
        } else if (drpdwnBtn.innerText == "Cardio 🏃") {
          if(!time_el.value || !distance_el.value) {
            alert("Please enter time and distance")
            return;
          } else if(!time_el) {
            alert("Please enter time")
            return;
          } else if(!distance_el) {
            alert("Please enter distance")
            return;
          } else {
            exerciseObject.time = time_el.value;
            exerciseObject.distance = distance_el.value;
            exerciseObject.date = formatted_date;
            exerciseObject.exercise = workoutName.innerText;
            exerciseObject.type = drpdwnBtn.innerText;
            updateExerciseObject(storageKeys, exerciseObject);
            let exerciseString = JSON.stringify(exerciseObject);
            console.log(exerciseString)
            localStorage.setItem(`${exerciseObject.exercise}`, exerciseString);
            let exerciseObj = JSON.parse(localStorage.getItem(exerciseObject.exercise))
            console.log(exerciseObject);
            console.log(exerciseObj);

            if(exerciseObject) {
              const dateObj = new Date(exerciseObject.date);
              const month = dateObj.toLocaleDateString('default', {month: 'long'});
              const year = dateObj.getFullYear();
              const day = dateObj.getDate();
              const monthDisplay = document.querySelector('#monthDisplay');
              const day_els = document.querySelectorAll('#calendar .day:not([class*="padding"])');
              const exerciseKey = workoutName.innerText;
              
              day_els.forEach(day_el => {
              if (monthDisplay.textContent.includes(month) && monthDisplay.textContent.includes(year)) {
                if (day_el.innerText == day) {
                  console.log(day_el);
                  console.log(day);
                  const existingWorkout = day_el.querySelector('.workout_event');
                  console.log(existingWorkout);
                  if (existingWorkout) {
                    existingWorkout.innerText = exerciseKey;
                  } else {
                    const workout = document.createElement('div');
                    workout.classList.add('workout_event');
                    workout.innerText = exerciseKey;
                    day_el.appendChild(workout);
                  }
                }
                exerciseDataContainer.innerHTML = "";
              }
            });
            
            load();
          }
              
        };
      };  
    };
    });

      addRepsBtn.addEventListener('click', () => {
        const exerciseKey = exerciseObject.exercise;

        for(let i = 1; ; i++) {
          const rep = document.getElementById(`rep_` + i);
          const weight = document.getElementById(`weight_` + i);

          if(!rep || !weight) {
            break;
          };

          if (rep && weight) {           
            if (!rep.value && !weight.value) {
              alert(`Please enter the amount of reps and weight for set ${i}.`);
              return;
            } else if (!rep.value) {
              alert(`Please enter the amount of reps for set ${i}`);
              return;
            } else if (!weight.value) {
              alert(`Please enter the amount of weight for set ${i}.`);
              return;
            }

            exerciseObject[rep.id] = rep.value;
            exerciseObject[weight.id] = weight.value;
            const exerciseString = JSON.stringify(exerciseObject);
            localStorage.setItem(`${exerciseObject.exercise}`, exerciseString);
            } 
          }
      let exerciseObj = JSON.parse(localStorage.getItem("exerciseObject"))
      console.log(exerciseObj);

      const exerciseLoggedData = JSON.parse(localStorage.getItem(exerciseKey));
      console.log(exerciseLoggedData);


      if(exerciseLoggedData) {

        const dateObj = new Date(exerciseLoggedData.date);
        const month = dateObj.toLocaleDateString('default', {month: 'long'});
        const year = dateObj.getFullYear();
        const day = dateObj.getDate();
        console.log(month);
        console.log(year);
        console.log(day);
        const monthDisplay = document.querySelector('#monthDisplay');
        const day_els = document.querySelectorAll('#calendar .day:not([class*="padding"])');
        
        day_els.forEach(day_el => {
        if (monthDisplay.textContent.includes(month) && monthDisplay.textContent.includes(year)) {
          if (day_el.innerText == day) {
            console.log(day_el)
            const existingWorkout = day_el.querySelector('.workout_event');
            if (existingWorkout) {
              existingWorkout.innerText = exerciseKey;
            } else {
              const workout = document.createElement('div');
              workout.classList.add('workout_event');
              workout.innerText = exerciseKey;
              day_el.appendChild(workout);
            }
          }
        }
      }); 
    }
    exerciseDataContainer.innerHTML = '';
    console.log(exerciseDataContainer);
    setTimeout(() => {
      load();
      location.reload(); 
    }, 0);
  });
}       
});
