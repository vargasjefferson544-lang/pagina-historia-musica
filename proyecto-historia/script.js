document.addEventListener('DOMContentLoaded', function() {

    // --- Funcionalidad del Buscador Mejorada ---
    const searchInput = document.getElementById('searchInput');
    const timelineItems = document.querySelectorAll('.timeline-item');

    searchInput.addEventListener('keyup', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        timelineItems.forEach(item => {
            const name = item.dataset.name.toLowerCase();
            const year = item.dataset.year;
            const inventor = item.dataset.inventor.toLowerCase();

            // Si el término de búsqueda está incluido en el nombre, año o inventor
            if (name.includes(searchTerm) || year.includes(searchTerm) || inventor.includes(searchTerm)) {
                item.style.display = 'block'; // O el display que uses
            } else {
                item.style.display = 'none';
            }
        });
    });


    // --- Scroll Horizontal con el Mouse (drag-to-scroll) ---
    const timelineContainer = document.querySelector('.timeline-container');
    if (window.innerWidth > 768) { // Solo activar en escritorio
        let isDown = false;
        let startX;
        let scrollLeft;

        timelineContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - timelineContainer.offsetLeft;
            scrollLeft = timelineContainer.scrollLeft;
        });

        timelineContainer.addEventListener('mouseleave', () => {
            isDown = false;
        });

        timelineContainer.addEventListener('mouseup', () => {
            isDown = false;
        });

        timelineContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - timelineContainer.offsetLeft;
            const walk = (x - startX) * 2; 
            timelineContainer.scrollLeft = scrollLeft - walk;
        });
    }

});