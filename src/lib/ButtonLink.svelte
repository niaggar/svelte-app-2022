<script>
  export let visibleText = '';
  export let route = '';
  export let type = '';
</script>


<a href="{route}" class="{type}">{visibleText}</a>


<style>
  a {
    color: var(--gray);
    width: 100%;
    padding: 0.6em;
    text-decoration: none;
    border-radius: 0.5em;
    margin: 0.5em 0em 0em 0em;
    text-align: center;
  }
  
  a.yellow {
    background-color: var(--yellow);
  }

  a.orange {
    background-color: var(--orange);
  }

  a.green {
    background-color: var(--green-w);
  }
</style>