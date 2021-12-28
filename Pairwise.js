function p_init() {
    fetch("http://" + hostname + ":" + port + "/" + ['flights'].join('/'))
        .then(response => response.json())
        .then(obj => {
            var e = document.getElementById('file-select')
            e.innerHTML = ''
            obj.forEach(x => {
                var o = document.createElement('option')
                o.innerHTML = x
                e.appendChild(o)
            })
        })
        .catch(err => console.error(err));
    var par1 = document.getElementById('parameter-1')
    var par2 = document.getElementById('parameter-2')
    var par3 = document.getElementById('parameter-3')
    var par4 = document.getElementById('parameter-4')
    flight_parameters.forEach(x => {
        var o1 = document.createElement('option')
        var o2 = document.createElement('option')
        var o3 = document.createElement('option')
        var o4 = document.createElement('option')
        o1.innerHTML = x
        o2.innerHTML = x
        o3.innerHTML = x
        o4.innerHTML = x
        par1.appendChild(o1)
        par2.appendChild(o2)
        par3.appendChild(o3)
        par4.appendChild(o4)
    })
}

function single_graph() {
    location.href = "Client.html";
}