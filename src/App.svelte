<script>
  import SortableList from "svelte-sortable-list";
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
  function updateElementPositions(ev) {
    var batch = db.batch();
    let newArrList = ev.detail;
    arrList.forEach((el, index) => {
      if (arrList[index].data().pos === newArrList[index].data().pos) {
        console.log(
          "Position not changed for Item",
          arrList[index].data().name
        );
      } else {
        console.log("Position  changed for Item", arrList[index].data().name);
        batch.update(db.collection("list").doc(arrList[index].id), {
          pos: newArrList[index].data().pos
        });
      }
    });
    batch.commit();
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
<SortableList
  list={arrList}
  key="id"
  on:sort={updateElementPositions}
  let:index>
  <button on:click={() => deleteItem(arrList[index].id)}>X</button>
  {#if arrList[index].editMode == true}
    <input
      type="text"
      value={arrList[index].data().name}
      bind:this={arrList[index].inputUpdateEl} />
    <button
      on:click={() => {
        updateItem(arrList[index].id, arrList[index].inputUpdateEl.value);
      }}>
      Update!
    </button>
  {:else}
    <span
      on:click={() => {
        arrList[index].editMode = true;
        arrList = arrList;
      }}>
      {arrList[index].data().name}
    </span>
  {/if}
</SortableList>
