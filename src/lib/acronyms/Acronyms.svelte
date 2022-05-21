<script>
    import acr from '$lib/acronyms/acronyms.json'
    import {srcValue, filtered} from '$lib/stores'
    import {matchSorter} from 'match-sorter'
    import { onMount } from 'svelte';
    const items = acr.content
    onMount(async () =>
    {
        srcValue.subscribe( () => {
            filtered.set(matchSorter(items, $srcValue, {keys : ['acr', 'term', 'desc']}));
            if (document) {
                let div1 = document.getElementById('div1')
                if (div1 != null) {
                    div1.scrollTop = 0;
            }}
        });
    }   )
    let rowhighlight = ''
    
    
    
</script>
<div id='div1'>
    <table id="tbl1">
        <colgroup>
            <col id="col1"/>
            <col id="col2"/>
            <col id="col3"/>
        </colgroup>
        <thead>
            <th>Acronym</th>
            <th>Term</th>
            <th>Description</th>
        </thead>
        <tr id='parter'>
            <td class='small'></td>
            <td class='small'></td>
            <td class='small'></td>
        </tr>
    {#each $filtered as it,i}
        <p style='display:none'>   
        {#if i%2 == 0}
            {rowhighlight = 'highlight'}
        {:else}
            {rowhighlight = ''}
        {/if}
        </p>
        <tr class={rowhighlight}>
            <td>
                {it.acr}
            </td>
            <td>
                {it.term}
            </td>
            <td>
                {it.desc}
            </td>
        </tr>
    {/each}
    </table>
</div>
<style>
    #div1 {
        overflow: auto;
    }
    #tbl1, tr,td {
        border: 0;
        margin: 0;
        padding: var(--gutter) 0 var(--gutter) var(--gutter);
        border-collapse: collapse;
    }
    td {
        color: var(--light-text);
    }
    
    .highlight {
        background-color: var(--science-blue-dimmed);
    }
    #tbl1 {
        width: 100%;
        table-layout: fixed;
    }
        
    #col1 {
        width: 10%;
    }
    #col2, #col3 {
        width: 45%;
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
    }
    #parter {
        position: -webkit-sticky;
        position: sticky;
        top: 2.15rem;
        height: 2px;
        background-color: var(--light-text);
    }
    .small {
        padding: 0;
    }
</style>