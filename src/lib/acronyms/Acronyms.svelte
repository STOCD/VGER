<script>

import { srcValue, filtered, activeTab, mobile, mobile_description, mobile_menu_active } from '$lib/stores';
import { matchSorter } from 'match-sorter';
import { onMount } from 'svelte';

export let acr;
const acronyms = acr;
let currentLink = null;

// bind search string to filter module
onMount( () => {
    srcValue.subscribe( () => {
        filtered.set(matchSorter(acronyms, $srcValue, {keys : ['acr', 'term', 'desc']}));
        let div1 = document.getElementById('div1')
        if (div1 != null) {
            div1.scrollTop = 0;
        }
    });
});

// handles click on row
function rowClickAction(title=null, text=null, link=null) {
    currentLink = link
    if ($mobile) {
        showDescription(title, text, link);
        $mobile_menu_active = false;
    }
    else {
        openURL()
    }
}

function openURL() {
    open(currentLink, '_blank', 'noopener,noreferrer')
}

//shows description section for mobile
function showDescription(title, text, link) {
    if ($mobile) {
        $mobile_description = title + ': '+text;
        document.getElementById('description').style.visibility = 'visible';
        document.getElementById('description').style.opacity = '1';
    }
}

//hides description section for mobile
function hideDescription() {
    document.getElementById('description').style.opacity = '0';
    setTimeout( () => document.getElementById('description').style.visibility = 'hidden', 510);    
}
</script>

<!-- Description Section for mobile; hidden by default -->
<div id='description'>
    <p class='text'>
        {$mobile_description}
    </p>
    <div class='desc_div' style="margin-bottom: var(--gutter);">
        <button class='desc_button' on:click={()=>openURL()}>Open Wiki</button>
    </div>
    <div class='desc_div'>
        <button class='desc_button' on:click={()=>hideDescription()}>Close</button>
    </div>
</div>

<!-- Acronyms table -->
<div id='div1'>

    <table id="tbl1">
        <colgroup>
            <col class='column1' class:column1_mobile={$mobile}/>
            <col class='column2' class:column2_mobile={$mobile}/>
            <col class='column3' class:column3_mobile={$mobile}/>
        </colgroup>
        <thead>
            <th>Acronym</th>
            <th>Term</th>
            {#if !$mobile}
                <th>Description</th>
            {/if}
        </thead>
        {#each $filtered as it}
            <tr on:click={()=>rowClickAction(it.term, it.desc, it.link)}>
                <td>
                    {it.acr}
                </td>
                <td>
                    {it.term}
                </td>
                {#if !$mobile}
                    <td>
                        {it.desc}
                    </td>
                {/if}
            </tr>
        {/each}
    </table>

</div>

<style>
    #div1 {
        overflow-y: auto;
        overflow-x: hidden;
    }
    table {
        background-color: var(--dark-background);
    }
    #tbl1, tr,td {
        border: 0;
        margin: 0;
        padding: var(--gutter) 0 var(--gutter) var(--gutter);
        border-collapse: collapse;
        overflow: inherit;
    }
    tr,td {
        border-radius: var(--gutter);
        cursor: pointer;
    }
    td {
        color: var(--light-text);
    }
    tr:nth-child(2n+1) td {
        background-color: var(--science-blue-dimmed);
        border-radius: 0;
    }
    tr:nth-child(2n+1) td:first-child {
        border-radius: var(--gutter) 0 0 var(--gutter);
    }
    tr:nth-child(2n+1) td:last-child {
        border-radius: 0 var(--gutter) var(--gutter) 0;
    }
    #tbl1 {
        width: 100%;
        table-layout: fixed;
    }
        
    .column1 {
        width: 10%;
    }
    .column2, .column3 {
        width: 45%;
    }
    .column1_mobile {
        width: 30%;
    }
    .column2_mobile {
        width: 70%;
    }
    .column3_mobile {
        width: 0;
    }
    th {
        position: -webkit-sticky;
        position: sticky;
        top:0;
        background-color: var(--dark-background);
        color: var(--light-text);
        font-weight: bold;
        text-align: left;
        padding: var(--gutter) 0 var(--gutter) var(--gutter);
        box-shadow: 0 var(--border) 0 var(--gray-text);
    }
    .text {
        color: var(--light-text);
        margin: var(--gutter);
        margin-bottom: calc(2*var(--gutter));
    }
    #description {
        position: absolute;
        top: 2.5rem;
        width: calc(100% - 4*var(--gutter));
        padding: var(--gutter);
        border: var(--border) solid var(--science-blue);
        background-color: var(--dark-background-hover);
        margin: 0;
        opacity: 0;
        visibility: hidden;
        transition: opacity .5s;
        z-index: 5;
    }
    .desc_button {
        background-color: rgba(0,0,0,0);
        border: calc(.5*var(--border)) solid var(--gray-text);
        border-radius: calc(.5*var(--gutter));
        padding: calc(.5*var(--gutter));
        padding-bottom: calc(.7*var(--gutter));
        width: 100%;
        height: calc(3.5*var(--gutter));
        color: var(--gray-text);
    }
    .desc_div {
        width: 100%;
        display: flex;
        justify-content: center;
    }
</style>
