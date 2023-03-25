window.addEventListener('load', () => {
    const form = document.querySelector("#task-form");
    const input =  document.querySelector(".to-do");
    const list_el = document.querySelector(".tasks");
    let task_el;

    ;
    

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
    const workoutContainer= document.querySelector('.workout-container')
    const drpdwnBtn = document.querySelector(".dropbtn");
    const workoutData = document.querySelector(".workout-data")
    const exerciseInput = document.querySelector(".exercise-input")

    let optionSelected = false;
    let setsCreated = false;
    let cardioInputsCreated = false;
    let time_el, distance_el, reps_el

    const exerciseSubmit = document.querySelector(".exercise-submit");
    const workoutDate = document.querySelector(".workout_date");
    const workoutDate_el = document.createElement('h4');
    workoutDate_el.setAttribute('id','date-input')
  
    const addExercise = document.querySelector(".exercise-submit")
    const exercise_el = document.querySelector(".add-exercise")

    exerciseSubmit.setAttribute("hidden", "");
    workoutDate.setAttribute("hidden", "");
    
    dropdown.addEventListener('click', (e) => {
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
          exercise_el.appendChild(sets_el);
          setsCreated = true;
          
        }
          optionSelected = true;
        } else if(e.target.textContent == "Cardio 🏃") {
          // hide sets input
          if(setsCreated) {
            const setsEl = document.querySelector(".sets_input");
            exercise_el.removeChild(setsEl);
            setsCreated = false;workoutContainer
            workoutContainer
            workoutContainer
            workoutContainer
            workoutContainer
          }

          // create cardio inputs
          if(!cardioInputsCreated) {
            time_el = document.createElement("input");
            time_el.type = "number";
            time_el.name = "time";
            time_el.classList.add("time_input");
            time_el.placeholder = "Time (min)";
            exercise_el.appendChild(time_el);2
        
            distance_el = document.createElement("input");
            distance_el.type = "text";
            distance_el.name = "distance";
            distance_el.classList.add("distance_input");
            distance_el.placeholder = "Distance (mi)";
            exercise_el.appendChild(distance_el);

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

      addExercise.addEventListener('click', (e) => {
        const sets = document.querySelector('.sets_input');
        const time = document.querySelector('.time_input');
        const distance = document.querySelector('distance_input');
        console.log(sets.value)
      
        const  workoutName = document.createElement('h3');
        workoutName.classList.add('workout_name');
        workoutName.innerText = exerciseInput.value;
        workoutContainer.appendChild(workoutName);
        console.log(workoutDate.value)
        console.log(workoutName.innerText);

        const workoutDate_value = workoutDate.value;
        if(!workoutDate_value) {
          alert("Please select date")
          return;
        };

        // Parse the date value inot a Date object
        const workoutDate_obj = new Date(workoutDate_value);

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
        workoutName.appendChild(workoutDate_el);

        if(drpdwnBtn.innerText == "Weight Training 🏋️" || drpdwnBtn.innerText == "Calisthenics 💪") {
          for(let i = 0; i < sets.value; i++) {
          reps_el = document.createElement("input");
          reps_el.type = "text"
          reps_el.name = `reps_${i}`
          reps_el.classList.add("reps_input");
          reps_el.placeholder = `Rep${i +1}`;
          workoutName.appendChild(reps_el);

          weight_el = document.createElement("input");
          weight_el.type = "text"
          weight_el.name = `weight_${i}`
          weight_el.classList.add("weight_input");
          weight_el.placeholder = "Weight (lbs)";
          workoutName.appendChild(weight_el);
          
          workoutName.appendChild(addRepsBtn)
          addRepsBtn.removeAttribute("hidden");
          
        }
        }
      })
    });
