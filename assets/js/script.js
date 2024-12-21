async function obtenerDatos() {
  try {
    const res = await fetch("https://mindicador.cl/api");
    const datos = await res.json();
    return datos;
  } catch (error) {
    alert(error);
  }
}
async function llenarLista() {
  const htmlLista = document.querySelector("#inMoneda");
  try {
    const mindicador = await obtenerDatos();
    Object.keys(mindicador).forEach((clave) => {
      const moneda = mindicador[clave];
      if (moneda.nombre) {
        htmlLista.innerHTML += `
                <option value="${moneda.codigo}">${moneda.nombre}</option>
            `;
      }
    });
  } catch (error) {
    alert(error.message);
  }
}
llenarLista();

const btnConvertir = document.querySelector("#btnConvertir");
btnConvertir.addEventListener("click", async () => {
  const valor = document.querySelector("#inPesos").value;
  const codigo = document.querySelector("#inMoneda").value;
  console.log(codigo);
  try {
      const mindicador = await obtenerDatos();
      const base = mindicador[codigo].valor;
      const total = valor / base;
      const resultado = document.querySelector("#textResultado");
      resultado.innerHTML = `
      Resultado : ${total} ${codigo}
      `;
    } catch (error) {
    alert(error.message);
  }
  renderGrafica();
});

async function getAndCreateDataToChart() {
    const monedaSeleccionada = document.querySelector("#inMoneda").value;
    const res = await fetch(`https://mindicador.cl/api/${monedaSeleccionada}`);
    const datos = await res.json();
    const ultimos10Dias = datos.serie.slice(0, 10).reverse();
    const labels = ultimos10Dias.map((dia) => dia.fecha.split("T")[0]);
    const data = ultimos10Dias.map((dia) => Number(dia.valor));
    const datasets = [
        {
            label: `Valor de ${monedaSeleccionada}`,
            borderColor: "rgb(255, 99, 132)",
            data
        }
    ];
    return { labels, datasets };
}

async function renderGrafica() {
    document.getElementById("grafico").innerHTML = `
                            <h1>Valor de los ultimos 10 días</h1>
                <canvas id="myChart" width="400" height="200"></canvas>
        `;
    const data = await getAndCreateDataToChart();
    const config = {
        type: "line",
        data
    };
    const myChart = document.getElementById("myChart");
    new Chart(myChart, config);
}




