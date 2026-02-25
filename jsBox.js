document.addEventListener('DOMContentLoaded', function(){
    // Define the three main timezones here (format: TZ:Label,TZ:Label,TZ:Label)
    const tzString = "America/Los_Angeles:PST,Asia/Tokyo:JST,Asia/Seoul:KST";
    const mainZones = tzString.split(',').map(function(item){
        const parts = item.split(':');
        return { tz: parts[0].trim(), label: (parts[1] || parts[0]).trim() };
    });

    // Build layout: left column (main zones) + right column (scrolling full tz list)
    const root = document.getElementById('zonesRoot');
    const layout = document.createElement('div');
    layout.className = 'mainLayout';

    const leftCol = document.createElement('div');
    leftCol.className = 'leftCol';

    const rightCol = document.createElement('aside');
    rightCol.className = 'rightCol';

    layout.appendChild(leftCol);
    layout.appendChild(rightCol);
    root.appendChild(layout);

    // Create main zone cards on the left
    mainZones.forEach(function(z, idx){
        const container = document.createElement('div');
        container.className = 'contentContainer';

        const timeBox = document.createElement('div');
        timeBox.className = 'timeBox';

        const timeP = document.createElement('p');
        timeP.className = 'boxContent';
        timeP.id = `time-${idx}`;

        const dateP = document.createElement('p');
        dateP.className = 'boxContent-sub';
        dateP.id = `date-${idx}`;

        timeBox.appendChild(timeP);
        timeBox.appendChild(dateP);

        const labelP = document.createElement('p');
        labelP.className = 'label info';
        labelP.textContent = z.label;

        timeBox.appendChild(labelP);

        container.appendChild(timeBox);
        leftCol.appendChild(container);

        function refresh(){
            const dayAndTime = new Date().toLocaleTimeString('en-US', { weekday: 'short', timeZone: z.tz });
            const date = new Date().toLocaleString('en-US', { timeZone: z.tz }).split(',')[0];
            timeP.innerHTML = dayAndTime;
            dateP.innerHTML = date;
        }

        refresh();
        setInterval(refresh, 1000);
    });

    // Use TIMEZONE_LIST constant (loaded via timezoneList.js) to populate the right column
    (function(){
        const tzAll = (typeof TIMEZONE_LIST !== 'undefined') ? TIMEZONE_LIST : [];

        // build scrolling list
        const tzViewport = document.createElement('div');
        tzViewport.className = 'tzViewport';

        const tzInner = document.createElement('div');
        tzInner.className = 'tzListInner';

        const itemElements = [];
        tzAll.forEach(function(tz){
            const item = document.createElement('div');
            item.className = 'tzItem';
            item.dataset.tz = tz;
            itemElements.push(item);
            tzInner.appendChild(item);
        });

        // Function to update timezone times
        function updateTzTimes(){
            itemElements.forEach(function(item){
                const tz = item.dataset.tz;
                const time = new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    timeZone: tz 
                });
                item.textContent = tz + ' • ' + time;
            });
        }
        updateTzTimes();
        setInterval(updateTzTimes, 1000);

        // duplicate content for seamless loop
        tzInner.innerHTML += tzInner.innerHTML;

        tzViewport.appendChild(tzInner);
        rightCol.appendChild(tzViewport);

        // set animation speed proportional to items (slower for readability)
        const speed = Math.max(50, tzAll.length * 0.35); // seconds
        tzInner.style.animation = `scrollUp ${speed}s linear infinite`;

        // match right column height to left column
        function syncHeights(){
            rightCol.style.height = leftCol.offsetHeight + 'px';
        }
        syncHeights();
        window.addEventListener('resize', syncHeights);
    })();
});