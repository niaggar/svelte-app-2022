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
    cursor: pointer;
  }

  button:hover {
    filter: saturate(1.5);
    filter: contrast(1.5);
  }
  
  button.yellow {
    background-color: var(--yellow);
  }

  button.orange {
    background-color: rgb(245, 196, 184);
    border: 2px solid rgb(223, 80, 44);
    color: rgb(136, 43, 19);
  }

  button.green {
    background-color: var(--green-w);
  }

  button.gray {
    background-color: rgb(231, 231, 231);
    text-align: left;
    padding-left: 1rem;
    border: 2px solid rgb(126, 126, 126) ;
  }
</style>