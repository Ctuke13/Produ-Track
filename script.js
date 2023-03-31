window.addEventListener('load', () => {

  /*------CALENDAR----------*/

    let nav = 0; // How we keep track of what month we're on
    let clicked = null;
    let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

    const calendar = document.getElementById('calendar');
    const newEventModal = document.getElementById('newEventModal');
    const deleteEventModal = document.getElementById('deleteEventModal');
    const backDrop = document.getElementById('modalBackDrop');
    const eventInput= document.getElementById('eventInput');
    const dayTitle = document.querySelector('.eventTitle');
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    function openModal(date) {
      clicked = date;
      console.log(dayTitle.innerText);
      dayTitle.innerText = date;
      console.log(dayTitle.innerText);
      const eventForDay = events.find(e => e.date === clicked);

      if (eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block';
      } else {
        newEventModal.style.display = 'block';
        backDrop.style.display = 'block';
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
      deleteEventModal.style.display = 'none';
      backDrop.style.display = 'none';
      eventInput.value = '';
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

    function deleteEvent() {
      events = events.filter(e => e.date !== clicked);
      localStorage.setItem('events', JSON.stringify(events));
      closeModal();
    };

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
      
      document.getElementById('deleteButton').addEventListener('click', deleteEvent);
      document.getElementById('closeButton').addEventListener('click', closeModal);
    };

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
                  seletestction.addRange(range);
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
    let time_el, distance_el, reps_el, weight_el;

    const exerciseSubmit = document.querySelector(".exercise-submit");
    const workoutDate = document.querySelector(".workout_date");
    const workoutDate_el = document.createElement('h4');
    workoutDate_el.setAttribute('id','date-input');
    
  
    const addExercise = document.querySelector(".exercise-submit")
    const exercise_el = document.querySelector(".add-exercise")

    exerciseSubmit.setAttribute("hidden", "");
    workoutDate.setAttribute("hidden", "");
    
    dropdown.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(e.target.textContent);
      drpdwnBtn.innerText = e.target.textContent;
      workoutDate.removeAttribute("hidden");

        if(e.target.textContent == "Weight Training 🏋️" || e.target.textContent == "Calisthenics 💪") {
          // hide cardio inputs
          if (cardioInputsCreated) {
            exercise_el.removeChild(time_el);
            exercise_el.removeChild(distance_el);
            cardioInputsCreated = false;
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

      } else {
        optionSelected = false;
      }

      if (optionSelected) {
        exerciseSubmit.removeAttribute("hidden");
      } else {
        exerciseSubmit.setAttribute("hidden", "");
      }
      });

      const addRepsBtn = document.querySelector('.reps_weight_btn');
      addRepsBtn.setAttribute("hidden", "");

      const addCardioBtn = document.querySelector('.time_distance_btn');
      addRepsBtn.setAttribute("hidden", "");
      
      let exerciseObject = {};

      addExercise.addEventListener('click', (e) => {
        const sets = document.querySelector('.sets_input');
        const time = document.querySelector('.time_input');
        const distance = document.querySelector('distance_input');

        const  exerciseData = document.createElement('h3');
        exerciseData.classList.add('exercise_data');

        const workoutName = document.createElement('div')
        workoutName.classList.add('workout_name')
        exerciseData.appendChild(workoutName);
        workoutName.innerText = exerciseInput.value;
        workoutContainer.appendChild(exerciseData);
        console.log(workoutDate.value);
        console.log(exerciseData.innerText);

        const workoutDate_value = workoutDate.value;
        if(!workoutDate_value) {
          alert("Please select date")
          return;
        };

        // Parse the date value into a Date object
        const workoutDate_obj = new Date(`${workoutDate_value}T00:00:00.000`);
        workoutDate_obj.setMinutes(workoutDate_obj.getMinutes() + workoutDate_obj.getTimezoneOffset());

        // Get the user's preferred lanuage and country
        const user_locale = navigator.language || 'en-US';

        // Format the date using the user's locale
        const formatted_date = workoutDate_obj.toLocaleDateString( user_locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })

        
        // Set content of the h4 element to the formatted date
        workoutDate_el.textContent = formatted_date;
        exerciseData.appendChild(workoutDate_el);
        console.log(workoutDate_obj)

        const date = workoutDate_obj.getDate();
        console.log(date);

        if(drpdwnBtn.innerText == "Weight Training 🏋️" || drpdwnBtn.innerText == "Calisthenics 💪") {
          for(let i = 0; i < sets.value; i++) {
          reps_el = document.createElement("input");
          reps_el.type = "text"
          reps_el.name = `rep_${i +1}`
          reps_el.classList.add("reps_input");
          reps_el.id = `rep_${i + 1}`
          reps_el.placeholder = `Rep ${i +1}`;
          exerciseData.appendChild(reps_el);

          weight_el = document.createElement("input");
          weight_el.type = "text"
          weight_el.name = `weight_${i + 1}`
          weight_el.classList.add("weight_input");
          weight_el.id = `weight_${i + 1}`
          weight_el.placeholder = "Weight (lbs)";
          exerciseData.appendChild(weight_el);

          exerciseData.appendChild(addRepsBtn)
          addRepsBtn.removeAttribute("hidden");
          } 
        } else if (drpdwnBtn.innerText == "Cardio 🏃") {

        }
        
        if(exerciseData.children.length > 0) {
        const lastElement = exerciseData.children[exerciseData.children.length - 2];
          lastElement.style.marginBottom = "0px";
        }

        exerciseObject.exercise = workoutName.innerText;
        exerciseObject.date = formatted_date;
    });

    
      addRepsBtn.addEventListener('click', () => {
        let i = 1;
        let repsExist = true;
        let weightExist = true;
        while(repsExist && weightExist) {
          let rep = document.getElementById('rep_' + i);
          let weight = document.getElementById('weight_' + i);

          if (rep && weight) {           
            if (!rep.value && !weight.value) {
              alert('Please enter a value for both rep and weight.');
            } else if (!rep.value) {
              alert(`Please enter a value for rep ${rep.id}`);
            } else {
              alert(`Please enter a value for weight ${weight.id}.`);
            }
            exerciseObject[rep.id] = rep.value;
            exerciseObject[weight.id] = weight.value;
            i++;  
          } else {
          repsExist = false;
          weightExist = false;
          break;
        }
      }
    });
        console.log(exerciseObject);
  });
