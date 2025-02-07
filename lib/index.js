const requestURL = './lib/data.json';
const request = new XMLHttpRequest();
document.addEventListener("DOMContentLoaded", () =>
{
    const name = document.querySelector('#take_name');
    const temp = document.querySelector('#temp');
    const back = document.querySelector('#back');
    const next = document.querySelector('#next');
    let page = 1;
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
            if(page != 1)
            {
                page -= 1;
            }
            updateList(data, page);
        });
        next.addEventListener('click',()=>
        {
            if((page + 1) < (data.length/10+1))
            {
                page += 1;
            }
            updateList(data, page);
        });
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
}