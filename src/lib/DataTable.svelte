<script>
  export let data = {};

  const DATA_MODEL = [
    {
      type: 'temperatura',
      unit: 'C',
      ref: 0,
    },
    {
      type: 'humedad',
      unit: '%',
      ref: 0,
    },
    {
      type: 'aire',
      unit: 'volt',
      ref: 1.5,
    },
    {
      type: 'sonido',
      unit: 'volt',
      ref: 1.5,
    },
    {
      type: 'uv',
      unit: 'UV (mW/cm^2)',
      ref: 'none',
    },
  ];
</script>

{#each data as { type, unit, value, level }}
  {#if type == 'temperatura'}
  <div class="cont-value">
    <p>Temperatura:</p>
    <div class="cont-progress">
      <div class="progress">
        <div class="progress-value"
          style="width: {(Number(value) + 30) * (100 / 90)}%;"
        ></div>
      </div>
      <p class="value">{value} {unit}</p>
    </div>
  </div>
  {/if}

  {#if type == 'humedad'}
  <div class="cont-value">
    <p>Humedad:</p>
    <div class="cont-progress">
      <div class="progress">
        <div class="progress-value"
          style="width: {(Number(value)) * (100 / 100)}%;"
        ></div>
      </div>
      <p class="value">{value} {unit}</p>
    </div>
  </div>
  {/if}

  {#if type == 'aire'}
  <div class="cont-value">
    <p>Contaminacion atmosferica:</p>
    <div class="cont-progress">
      <div class="progress">
        <div class="progress-value"
          style="width: {(Number(value)) * (100 / 3)}%;"
        ></div>
      </div>
      <p class="value">{value > 1.7 ? "Alto" : value > 1.5 ? "Normal" : "Bajo" }</p>
    </div>
  </div>
  {/if}

  {#if type == 'uv'}
  <div class="cont-value">
    <p>Radiacion UV:</p>
    <div class="cont-progress">
      <div class="progress">
        <div class="progress-value"
          style="width: {(Number(value)) * (100 / 15)}%;"
        ></div>
      </div>
      <p class="value">{value} {unit}</p>
    </div>
  </div>
  {/if}

  {#if type == 'sonido'}
  <div class="cont-value">
    <p>Contaminacion acustica:</p>
    <div class="cont-progress">
      <div class="progress">
        <div class="progress-value"
          style="width: {(Number(value) - 1) * (100 / 2)}%;"
        ></div>
      </div>
      <p class="value">{value > 2.5 ? "Muy alto" : value > 1.8 ? "Alto" : value > 1.5 ? "Normal" : "Bajo" }</p>
    </div>
  </div>
  {/if}
{/each}

<style>
  .cont-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .cont-value .cont-progress {
    width: 100%;
    display: grid;
    justify-content: center;
    align-items: center;
    column-gap: 1rem;
    grid-template-columns: 4fr 1fr;
  }

  .cont-value .cont-progress .progress {
    grid-column: 1;
    background: gray;
    justify-content: flex-start;
    border-radius: 15px;
    align-items: center;
    position: relative;
    padding: 0 5px;
    display: flex;
    height: 20px;
    width: 100%;
    margin: 8px 0 10px 0;
  }

  .progress-value {
    border-radius: 30px;
    background: #fff;
    height: 10px;
    width: 0;
  }

  .cont-value .cont-progress .value {
    grid-column: 2;
  }
</style>
