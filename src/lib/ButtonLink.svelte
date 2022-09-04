<script lang="ts">
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
    font-family: "Noto Sans", sans-serif;
    cursor: pointer;
    display: block;
  }

  a:hover {
    filter: saturate(1.5);
    filter: contrast(1.5);
  }
  
  a.yellow {
    background-color: rgb(245, 233, 204);
    border: 2px solid rgb(187, 137, 11);
    color: rgb(100 72 0);
  }

  a.orange {
    background-color: rgb(245, 196, 184);
    border: 2px solid rgb(223, 80, 44);
    color: rgb(136, 43, 19);
  }

  a.green {
    background-color: rgb(164, 199, 197);
    border: 2px solid rgb(40, 112, 107);
  }

  a.gray {
    background-color: rgb(197, 197, 197);
    text-align: left;
    padding-left: 1rem;
    border: 2px solid rgb(126, 126, 126) ;
  }

  a.white {
    background-color: rgb(255, 255, 255);
    text-align: left;
    padding-left: 1rem;
    border: 2px solid rgb(126, 126, 126) ;
  }
</style>