<script>
  import DataTable from '$lib/DataTable.svelte';
  import Card from '$lib/Card.svelte';
  import Section from '$lib/Section.svelte';

  const data = [
    { name: 'Contamiacion auditiva', unit: 'cm', value: 100, level: 'nor'},
    { name: 'CO2 en el aire', unit: 'cm', value: 100, level: 'hig'},
    { name: 'Nivel de rayos UV', unit: 'cm', value: 100, level: 'nor'},
    { name: 'Contaminacion termica', unit: 'cm', value: 100, level: 'med'},
  ]
</script>


<Section title="Resultados de la ultima medicion">
  <Card>
    <DataTable data={data} />
  </Card>

  <Card>
    <p>Ir a tomar una nueva medicion.</p>
  </Card>
</Section>


<style>
</style>
