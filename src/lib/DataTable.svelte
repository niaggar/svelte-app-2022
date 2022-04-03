<script>
  export let data = {};
</script>

<table>
  <thead>
    <tr>
      <th class="first-column" />
      <th>N</th>
      <th>M</th>
      <th>A</th>
      <th>Valor</th>
    </tr>
  </thead>

  <tbody>
    {#each data as { type, unit, value, level }}
      <tr>
        <td class="first-column">{type}:</td>

        <td class="nivel-column">
          <div
            class="nivel-circulo"
            class:activo={level === 'low'}
            style="color: #28706C;"
          />
        </td>

        <td class="nivel-column">
          <div
            class="nivel-circulo"
            class:activo={level === 'normal'}
            style="color: #F1C24A;"
          />
        </td>

        <td class="nivel-column">
          <div
            class="nivel-circulo"
            class:activo={level === 'high'}
            style="color: #F3643F;"
          />
        </td>

        <td class="valor-column">{value} {unit}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    font-size: 1rem;
    width: 100%;
    border-spacing: 5px;
    font-size: 15px;
  }

  table thead {
    font-size: 1rem;
    text-align: center;
  }

  table .first-column {
    padding-right: 5px;
    width: 7rem;
  }

  table .nivel-column {
    align-items: center;
    width: 1rem;
    padding: 0.5rem 0;
  }

  table .nivel-column > .nivel-circulo {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 100%;
    border: 2px solid currentColor;
    margin: 0 auto;
    box-sizing: border-box;
  }

  table .nivel-column .nivel-circulo.activo {
    background-color: currentColor;
  }

  table .valor-column {
    width: 5rem;
    text-align: left;
    padding-left: 1rem;
  }
</style>
