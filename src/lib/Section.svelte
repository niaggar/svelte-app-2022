<script lang="ts">
  export let title = 'Ejemplo de titulo';
</script>

<section>
  <h1>{title}</h1>
  <slot />
</section>

<style>
  section {
    width: 100%;
    margin-bottom: 1.5rem;
  }

  section h1 {
    font-weight: 200;
    font-size: 1.2rem;
    letter-spacing: 0.06em;
    text-transform: none;
  }
</style>
