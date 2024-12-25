<script>
    import Sidebar from '$lib/sidebar/Sidebar.svelte';
    import { mobile_sidebar_active } from '$lib/stores';

    // listens for request to show mobile sidebar
    mobile_sidebar_active.subscribe(()=>{
        try {
            let mobile_div = document.getElementById('mobile_sidebar');
            if ($mobile_sidebar_active == true) {
                mobile_div.style.transform = 'translateX(100vw)';
            }
            if ($mobile_sidebar_active == false) {
                mobile_div.style.transform = 'translateX(0)';
            }
        }
        catch {} 
    })

</script>

<!-- Mobile sidebar is basically the normal sidebar slotted inside a sliding div-->
<div id='mobile_sidebar'>
    <Sidebar/>
</div>

<style>
    div {
        width: calc(100vw - 2*var(--gutter));
        padding: calc(2*var(--gutter));
        background-color: var(--dark-background);
        overflow-y: visible;
        position: absolute;
        height: calc(100vh - 100vw * (143/1920) - 6 * var(--gutter));
        left: -100vw;
        transition: transform .5s cubic-bezier(0.075, 0.1, 0.165, 1);
        z-index: 3;
        border-top: calc(.5*var(--gutter)) solid var(--science-blue);
        margin-left: var(--gutter);
        border-bottom-left-radius: var(--gutter);
        border-bottom-right-radius: var(--gutter);
    }
</style>
