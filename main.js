    // Función para obtener las tareas almacenadas en localStorage
    function obtenerTareas() {
        const tareasJSON = localStorage.getItem('tareas');
        return tareasJSON ? JSON.parse(tareasJSON) : [];
      }
  
      // Función para guardar las tareas en localStorage
      function guardarTareas(tareas) {
        localStorage.setItem('tareas', JSON.stringify(tareas));
      }
  
      // Función para renderizar las tareas en el DOM
      function renderizarTareas() {
        const listaTareas = document.getElementById('taskList');
        listaTareas.innerHTML = '';
  
        const tareas = obtenerTareas();
  
        tareas.forEach(function(tarea, index) {
          const li = document.createElement('li');
          li.innerHTML = `
            <span class="${tarea.completada ? 'completed' : ''}">${tarea.texto}</span>
            <button onclick="completarTarea(${index})">Completar</button>
            <button onclick="eliminarTarea(${index})">Eliminar</button>
          `;
          listaTareas.appendChild(li);
        });
      }
  
      // Función para agregar una nueva tarea
      function agregarTarea() {
        const tareaInput = document.getElementById('taskInput');
        const nuevaTarea = tareaInput.value.trim();
  
        if (nuevaTarea !== '') {
          const tareas = obtenerTareas();
          tareas.push({ texto: nuevaTarea, completada: false });
          guardarTareas(tareas);
          renderizarTareas();
          tareaInput.value = '';
        }
      }
  
      // Función para completar una tarea
      function completarTarea(index) {
        const tareas = obtenerTareas();
        tareas[index].completada = !tareas[index].completada;
        guardarTareas(tareas);
        renderizarTareas();
      }
  
      // Función para eliminar una tarea
      function eliminarTarea(index) {
        const tareas = obtenerTareas();
        tareas.splice(index, 1);
        guardarTareas(tareas);
        renderizarTareas();
      }

let boton = document.getElementById("boton");

boton.onclick = function() {
    agregarTarea();
};

      // Renderizar tareas al cargar la página
      renderizarTareas();