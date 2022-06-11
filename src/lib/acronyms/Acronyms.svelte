<script>
    import {srcValue, filtered, acronyms, activeTab} from '$lib/stores';
    import {matchSorter} from 'match-sorter';
    import { onMount } from 'svelte';

        srcValue.subscribe( () => {
            if ($activeTab == 'Knowledgebase') {
            console.log('hey')
            console.log(acronyms);
            filtered.set(matchSorter(acronyms, $srcValue, {keys : ['acr', 'term', 'desc']}));
            if (document) {
                let div1 = document.getElementById('div1')
                if (div1 != null) {
                    div1.scrollTop = 0;
            }}
        }
        });

    
    
    
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
        <!--<tr class='parter'>
            <td class='small parter'></td>
            <td class='small parter'></td>
            <td class='small parter'></td>
        </tr>-->
    {#each $filtered as it}
        <tr>
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
    
    tr:nth-child(2n+1) {
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
        box-shadow: 0 var(--border) 0 #fff;
    }
</style>