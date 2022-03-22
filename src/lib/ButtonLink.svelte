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
    padding: 0.6rem;
    text-decoration: none;
    border-radius: 0.5rem;
    margin: 0.5rem 0rem 0rem 0rem;
    text-align: center;
    font-size: 16px;
  }
  
  a.yellow {
    background-color: var(--yellow);
  }

  a.orange {
    background-color: var(--orange);
    color: #fff;
  }

  a.green {
    background-color: var(--green-w);
  }
</style>