<script>
  export let visibleText = '';
  export let type = '';
  export let action = () => {};

  const handleClick = () => action();
</script>


<button on:click={handleClick} class="{type}">{visibleText}</button>


<style>
  button {
    color: var(--gray);
    width: 100%;
    padding: 0.6rem;
    text-decoration: none;
    border-radius: 0.5rem;
    margin: 0.5rem 0rem 0rem 0rem;
    text-align: center;
    outline: none;
    border: none;
    font-size: 16px;
    font-family: "Noto Sans", sans-serif;
  }
  
  button.yellow {
    background-color: var(--yellow);
  }

  button.orange {
    background-color: var(--orange);
    color: #fff;
  }

  button.green {
    background-color: var(--green-w);
  }
</style>