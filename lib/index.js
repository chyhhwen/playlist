const requestURL = './lib/data.json';
const request = new XMLHttpRequest();
document.addEventListener("DOMContentLoaded", () =>
{
    const name = document.querySelector('#take_name');
    const temp = document.querySelector('#temp');
    const back = document.querySelector('#back');
    const next = document.querySelector('#next');
    const list = document.querySelector('#list');
    let page = 1;
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    let threshold = 100;
    let isAnimating = false;

    request.open('GET', requestURL);
    request.responseType = 'json';
    request.onload = function()
    {
        const data = request.response.data;
        updateList(data, page);

        name.addEventListener('input', () =>
        {
            searchNames(data, name.value, temp);
        });

        back.addEventListener('click',()=>
        {
            if(page != 1 && !isAnimating)
            {
                page -= 1;
                updateList(data, page);
            }
        });

        next.addEventListener('click',()=>
        {
            if((page + 1) < (data.length/10+1) && !isAnimating)
            {
                page += 1;
                updateList(data, page);
            }
        });

        list.addEventListener('touchstart', handleTouchStart, { passive: true });
        list.addEventListener('touchmove', handleTouchMove, { passive: false });
        list.addEventListener('touchend', handleTouchEnd, { passive: true });

        function handleTouchStart(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }

        function handleTouchMove(e) {
            if (!startX || !startY) return;

            distX = e.touches[0].clientX - startX;
            distY = e.touches[0].clientY - startY;

            if (Math.abs(distX) > Math.abs(distY)) {
                e.preventDefault();
            }
        }

        function handleTouchEnd(e)
        {
            if (!startX || !startY) return;

            if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > threshold && !isAnimating)
            {
                if (distX > 0 && (page + 1) < (data.length/10+1))
                {
                    page -= 1;
                    updateList(data, page);
                }
                else if (distX < 0 && page > 1) {
                    page += 1;
                    updateList(data, page);
                }
            }

            startX = 0;
            startY = 0;
            distX = 0;
            distY = 0;
        }
    };
    request.send();
});

function searchNames(data, searchValue, tempElement)
{
    if (!searchValue)
    {
        tempElement.innerHTML = '';
        return;
    }

    for (const item of data) {
        if (item.sing_name.match(new RegExp(searchValue, 'i')))
        {
            tempElement.innerHTML = `<span>${item.song_id} ${item.sing_name}</span>`;
            return;
        }
    }
    tempElement.innerHTML = 'No matches found';
}

function updateList(data, page)
{
    const list = document.querySelector('#list');
    const nb = document.querySelector('#nb');
    const itemsPerPage = 10;
    let temp = "";
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(page * itemsPerPage, data.length);

    isAnimating = true;
    list.style.opacity = '0.5';
    list.style.transform = 'translateX(20px)';

    setTimeout(() => {
        for (let i = startIndex; i < endIndex; i++)
        {
            if (i < data.length)
            {
                temp += `
                    <div class="table">
                        <span>${data[i].song_id} - ${data[i].sing_name}</span>
                    </div>
                `;
            }
            else
            {
                break;
            }
        }
        list.innerHTML = temp;
        nb.innerHTML = '<span>'+ page +'</span>';

        list.style.opacity = '1';
        list.style.transform = 'translateX(0)';

        setTimeout(() => {
            isAnimating = false;
        }, 200);
    }, 100);
}
