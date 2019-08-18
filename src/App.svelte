<script>
  import { db } from "./firebase.js";
  export let name;
  let arrList = [];
  let newItemText = "";

  db.collection("list")
    .orderBy("pos", "asc")
    .onSnapshot(snapData => {
      arrList = snapData.docs;
    });
  function addItem() {
    let date = new Date();
    db.collection("list").add({ name: newItemText, pos: date.getTime() });
  }
  function deleteItem(itemId) {
    db.collection("list")
      .doc(itemId)
      .delete();
  }
  function updateItem(itemId, newItemValue) {
    db.collection("list")
      .doc(itemId)
      .update({ name: newItemValue });
  }
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>List</h1>
Add Item:
<input type="text" bind:value={newItemText} />
<button on:click={addItem}>Add</button>
<ul>
  {#each arrList as listItem}
    <li>
      <button on:click={() => deleteItem(listItem.id)}>X</button>
      {#if listItem.editMode == true}
        <input
          type="text"
          value={listItem.data().name}
          bind:this={listItem.inputUpdateEl} />
        <button
          on:click={() => {
            updateItem(listItem.id, listItem.inputUpdateEl.value);
          }}>
          Update!
        </button>
      {:else}
        <span
          on:click={() => {
            listItem.editMode = true;
            arrList = arrList;
          }}>
          {listItem.data().name}
        </span>
      {/if}

    </li>
  {/each}
</ul>
