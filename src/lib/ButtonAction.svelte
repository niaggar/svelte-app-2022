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
    background-color: rgb(245, 233, 204);
    border: 2px solid rgb(187, 137, 11);
    color: rgb(100 72 0);
  }

  button.orange {
    background-color: rgb(245, 196, 184);
    border: 2px solid rgb(223, 80, 44);
    color: rgb(136, 43, 19);
  }

  button.green {
    background-color: rgb(164, 199, 197);
    border: 2px solid rgb(40, 112, 107);
  }

  button.gray {
    background-color: rgb(197, 197, 197);
    text-align: left;
    padding-left: 1rem;
    border: 2px solid rgb(126, 126, 126) ;
  }

  button.white {
    background-color: rgb(255, 255, 255);
    text-align: left;
    padding-left: 1rem;
    border: 2px solid rgb(126, 126, 126) ;
  }
</style>