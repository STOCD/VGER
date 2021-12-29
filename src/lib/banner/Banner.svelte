<script>

</script>

<div>
  <div class='triangle' />
  <div class='pips'>
    <div class='pip empty' />
    <div class='pip filled' />
    <div class='pip filled' />
  </div>
</div>

<style>
  div {
    background-color: #313131;
    width: 100%;
    height: 4rem;
    position: relative;
    flex-shrink: 0;
  }

  .triangle {
    position: relative;
    height: 0;
    width: 0;
    background-color: transparent;
    margin-left: 2.5rem;
    border-left: 6.5rem solid transparent;
    border-right: 6.5rem solid transparent;
    border-top: 2.5rem solid var(--science-blue);
  }

  .triangle::after {
    content: '';
    height: 0;
    width: 0;
    top: -3rem;
    left: -6rem;
    position: absolute;
    border-left: 6rem solid transparent;
    border-right: 6rem solid transparent;
    border-top: 2.5rem solid white;
  }

  .pips {
    position: absolute;
    display: flex;
    justify-content: space-between;
    width: 4rem;
    height: 1rem;
    top: 1.5rem;
    left: 2.75rem;
    transform: rotate(23deg);
  }

  .pip {
    height: 0.8rem;
    width: 0.8rem;
    border-radius: 100%;
    border: 1px solid yellow;
  }

  .empty {
    background-color: black;
  }

  .filled {
    background-color: yellow;
  }
</style>