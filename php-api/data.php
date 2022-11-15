<?php
    
    file_put_contents('out.txt', 'info');
    if (file_exists('date.txt')) {
        $previous = intval(file_get_contents('date.txt'));
        $time_diff = time() - $previous;
        if ($time_diff < 172800) {
            exit(0);
        }
    }
    if (file_exists('status.txt')) {
        if (file_get_contents('status.txt') == 'Script is running!') {
            exit(0);
        }
    }
    else {
        exit(1);
    }
    file_put_contents('status.txt', 'Script is running!');
    //$filename = strval(time()) . '.txt';
    //file_put_contents($filename, 'start');

    //$start = hrtime(true);
    $image_url = 'https://sto.fandom.com/wiki/Special:Filepath/';
    $wiki_base = 'https://sto.fandom.com/wiki/';
    $image_suffix = '_icon.png';
    $starship_trait_query = $wiki_base . "Special:CargoExport?tables=Mastery&fields=Mastery._pageName,Mastery.trait,Mastery.traitdesc,Mastery.trait2,Mastery.traitdesc2,Mastery.trait3,Mastery.traitdesc3,Mastery.acctrait,Mastery.acctraitdesc&limit=1000&offset=0&format=json";
    $trait_query = $wiki_base . "Special:CargoExport?tables=Traits&&fields=_pageName%3DPage%2Cname%3Dname%2Cchartype%3Dchartype%2Cenvironment%3Denvironment%2Ctype%3Dtype%2Cisunique%3Disunique%2Cmaster%3Dmaster%2Cdescription%3Ddescription%2Crequired__full%3Drequired%2Cpossible__full%3Dpossible&&order+by=%60_pageName%60%2C%60name%60%2C%60chartype%60%2C%60environment%60%2C%60type%60&limit=2500&format=json";
    $equipment_query = $wiki_base . 'Special:CargoExport?tables=Infobox&&fields=_pageName%3DPage%2Cname%3Dname%2Crarity%3Drarity%2Ctype%3Dtype%2Cboundto%3Dboundto%2Cboundwhen%3Dboundwhen%2Cwho%3Dwho%2Chead1%3Dhead1%2Chead2%3Dhead2%2Chead3%3Dhead3%2Chead4%3Dhead4%2Chead5%3Dhead5%2Chead6%3Dhead6%2Chead7%3Dhead7%2Chead8%3Dhead8%2Chead9%3Dhead9%2Csubhead1%3Dsubhead1%2Csubhead2%3Dsubhead2%2Csubhead3%3Dsubhead3%2Csubhead4%3Dsubhead4%2Csubhead5%3Dsubhead5%2Csubhead6%3Dsubhead6%2Csubhead7%3Dsubhead7%2Csubhead8%3Dsubhead8%2Csubhead9%3Dsubhead9%2Ctext1%3Dtext1%2Ctext2%3Dtext2%2Ctext3%3Dtext3%2Ctext4%3Dtext4%2Ctext5%3Dtext5%2Ctext6%3Dtext6%2Ctext7%3Dtext7%2Ctext8%3Dtext8%2Ctext9%3Dtext9&&order+by=%60_pageName%60%2C%60name%60%2C%60rarity%60%2C%60type%60%2C%60boundto%60&limit=5000&format=json';
    ini_set('max_execution_time', '3500');


    function follow_redirect($url) {
        /*$co = curl_init($url);
        curl_setopt($co, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($co, CURLOPT_MAXREDIRS, 10);
        curl_exec($co);
        $target =  curl_getinfo($co, CURLINFO_EFFECTIVE_URL);
        curl_close($co);
        return $target;*/
        $co = curl_init();
        curl_setopt($co, CURLOPT_URL, $url);
        curl_setopt($co, CURLOPT_HEADER, true);
        curl_setopt($co, CURLOPT_FOLLOWLOCATION, false);
        curl_setopt($co, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($co);
        if (preg_match('~Location: (.*)~i', $result, $match)) {
            $location = trim($match[1]);
            $target = follow_redirect($location);
            return $target;
        }
        else {
            return $url;
        }
    }

    function compensate_url($x) {
        $x = str_replace(' ', '_', $x);
        $x = str_replace('/', '_', $x);
        $x = str_replace('%C2%A0', '_', $x);
        $x = str_replace('%26%2339%3B', '%27', $x);
        $x = str_replace('%26%2334%3B', '%22', $x);
        $x = str_replace('"', '%22', $x);
        $x = str_replace('&quot;', '%22', $x);
        $x = str_replace("'", '%27', $x);
        $x = str_replace(' ', '_', $x);
        return $x;
    }

    function compensate_wiki_desc($t) {
        if ($t === '' || is_null($t)) {
            return '';
        }
        $t = str_replace('&lt;', '<', $t);
        $t = str_replace('&gt;', '>', $t);
        $t = str_replace('{{ucfirst: ', '', $t);
        $t = str_replace('{{ucfirst:', '', $t);
        $t = str_replace('{{lc: ', '', $t);
        $t = str_replace('{{lc:', '', $t);
        $t = str_replace('{{', '', $t);
        $t = str_replace('}}', '', $t);
        $t = str_replace('&amp;', '&', $t);
        $t = str_replace('&#24;', '*', $t);
        $count = 0;
        while (str_contains($t, '[[') && str_contains($t, '|')) {
            $start = strpos($t, '[[');
            $end = strpos($t, '|');
            $t = substr($t, 0, $start) . substr($t, $end+1);
            $count = $count + 1;
            if ($count >= 5) {
                break;
            }
        }
        $t = str_replace('[[', '', $t);
        $t = str_replace(']]', '', $t);
        $t = str_replace('&#39;', "'", $t);
        $t = str_replace('&quot;', '"', $t);
        $t = str_replace('&#34;', '"', $t);
        return $t;
    }

    /*  Starship Trait section  */

    $starship_trait_json = json_decode(file_get_contents($starship_trait_query));
    $starship_trait_a = []; // associative array: name of the trait is the key
    $starship_trait_json_length = count($starship_trait_json);
    $counter = 0;

    foreach ($starship_trait_json as $current_trait) {
        if (property_exists($current_trait, 'trait') && $current_trait->trait != '' && !is_null($current_trait->trait)) {
            if (!array_key_exists($current_trait->trait, $starship_trait_a)) {
                $starship_trait_a[$current_trait->trait] = ['desc'=>$current_trait->traitdesc, 'obtained'=>[$current_trait->{'_pageName'}]];
            } else {
                array_push($starship_trait_a[$current_trait->trait]['obtained'], $current_trait->{'_pageName'});
            }  
        }
        if (property_exists($current_trait, 'trait2') && $current_trait->trait2 != '' && !is_null($current_trait->trait2)) {
            if (!array_key_exists($current_trait->trait2, $starship_trait_a)) {
                $starship_trait_a[$current_trait->trait2] = ['desc'=>$current_trait->traitdesc2, 'obtained'=>[$current_trait->{'_pageName'}]];
            } else {
                array_push($starship_trait_a[$current_trait->trait2]['obtained'], $current_trait->{'_pageName'});
            }  
        }
        if (property_exists($current_trait, 'trait3') && $current_trait->trait3 != '' && !is_null($current_trait->trait3)) {
            if (!array_key_exists($current_trait->trait3, $starship_trait_a)) {
                $starship_trait_a[$current_trait->trait3] = ['desc'=>$current_trait->traitdesc3, 'obtained'=>[$current_trait->{'_pageName'}]];
            } else {
                array_push($starship_trait_a[$current_trait->trait3]['obtained'], $current_trait->{'_pageName'});
            }  
        }
        if (property_exists($current_trait, 'acctrait') && $current_trait->acctrait != '' && !is_null($current_trait->acctrait)) {
            if (!array_key_exists($current_trait->acctrait, $starship_trait_a)) {
                $starship_trait_a[$current_trait->acctrait] = ['desc'=>$current_trait->acctraitdesc, 'obtained'=>[$current_trait->{'_pageName'}]];
            } else {
                array_push($starship_trait_a[$current_trait->acctrait]['obtained'], $current_trait->{'_pageName'});
            }  
        }
        if ($counter % 10 == 0) {
            file_put_contents('starship_traits_fetch.txt', number_format($counter*100 / $starship_trait_json_length, 2, ',', ''));
        }
        $counter++;
    }
    unset($current_trait, $counter);
    file_put_contents('starship_traits_fetch.txt', '100,00');

    $starship_trait_i = []; //indexed array; unsorted
    $st_l = count($starship_trait_a);
    $counter = 0;
    foreach ($starship_trait_a as $trait_name => $content) {
        $description = compensate_wiki_desc($content['desc']);
        $link = follow_redirect($image_url . compensate_url(str_replace(' ', '_', $trait_name)) . $image_suffix);
        array_push($starship_trait_i, ['name'=>$trait_name, 'type'=> 'Starship Trait', 'obtained'=>$content['obtained'], 'desc'=>$description, 'image'=>$link]);
        if ($counter % 10 == 0) {
            file_put_contents('starship_traits_links.txt', number_format($counter*100 / $st_l, 2, ',', ''));
        }
        $counter++;
    }
    unset($description, $trait_name, $content, $link, $counter);
    file_put_contents('starship_traits_links.txt', '100,00');


    /*
        $op = json_encode($starship_trait_i, JSON_UNESCAPED_SLASHES);
        file_put_contents('out.json', $op);
    */
    
    
    /* Personal Trait section */
    $specialization_traits = [
        'Arrest'=>'Constable (specialization)','Command Frequency'=>'Command Officer (specialization)',
        'Demolition Teams'=>'Commando (specialization)','Going the Extra Mile'=>'Miracle Worker (specialization)',
        'Predictive Algorithms'=>'Intelligence Officer (specialization)','Pedal to the Metal'=>'Pilot (specialization)',
        'Unconventional Tactics'=>'Strategist (specialization)','Critical Systems'=>'Temporal Agent Recruitment',
        "Hunter's Instinct"=>'Klingon Recruitment','Temporal Insight'=>'Delta Recruitment'
    ];
    $personal_trait_json = json_decode(file_get_contents($trait_query));
    $personal_traits_i = [];
    $personal_trait_json_length = count($personal_trait_json);
    $counter = 0;
    
    foreach ($personal_trait_json as $current_p_trait) {
        if (property_exists($current_p_trait, 'chartype') && $current_p_trait->chartype == 'char') {
            if (property_exists($current_p_trait, 'name') && $current_p_trait->name != '' && !is_null($current_p_trait->name)) {
                if (property_exists($current_p_trait, 'type') && !is_null($current_p_trait->type) && strtolower($current_p_trait->type) == 'starship') {
                    $obtained = ['Infinity Prize Pack: Starship Trait'];
                    foreach($specialization_traits as $sp_trait => $sp_sp) {
                        if (strtolower($current_p_trait->name) == strtolower($sp_trait)) {
                            $obtained = [$sp_sp];
                            break;
                        }
                    }
                    $link2 = follow_redirect($image_url . compensate_url(str_replace(' ', '_', $current_p_trait->name)) . $image_suffix);
                    array_push($starship_trait_i, ['name'=>$current_p_trait->name, 'type'=> 'Starship Trait', 'obtained'=>is_null($obtained) ? '' : $obtained, 'desc'=>compensate_wiki_desc($current_p_trait->description), 'image'=>$link2]);
                }
                else {
                    $type = '';
                    $environment = 'space';
                    $display_type = '';
                    $availability = '';
                    $availability_type = '';
                    if (property_exists($current_p_trait, 'environment')) {
                        $environment = $current_p_trait->environment;
                    }
                    if (property_exists($current_p_trait, 'type') && !is_null($current_p_trait->type) && strtolower($current_p_trait->type) == 'reputation') {
                        $type = 'reputation';
                        $display_type = strtoupper(substr($environment, 0, 1)) . substr($environment, 1) . ' Reputation Trait';
                    }
                    elseif (property_exists($current_p_trait, 'type') && !is_null($current_p_trait->type) && strtolower($current_p_trait->type) == 'activereputation') {
                        $type = 'activereputation';
                        $display_type = 'Active ' . strtoupper(substr($environment, 0, 1)) . substr($environment, 1) . ' Reputation Trait';
                    }
                    else {
                        $type = 'personal';
                        $display_type = 'Personal ' . strtoupper(substr($environment, 0, 1)) . substr($environment, 1) . ' Trait';
                    }
                    if (property_exists($current_p_trait, 'required') && count($current_p_trait->required) > 0 && ($current_p_trait->required)[0] != '') {
                        $availability = join(', ', $current_p_trait->required);
                        $availability_type = 'innate';
                    }
                    elseif (property_exists($current_p_trait, 'possible') && count($current_p_trait->possible) > 0 && ($current_p_trait->possible)[0] == '') {
                        $availability_type = 'other';
                    }
                    elseif (property_exists($current_p_trait, 'possible') && count($current_p_trait->possible) > 0 && ($current_p_trait->possible)[0] != '') {
                        $availability = join(', ', $current_p_trait->possible);
                        $availability_type = 'species';
                    }
                    $link2 = follow_redirect($image_url . compensate_url(str_replace(' ', '_', $current_p_trait->name)) . $image_suffix);
                    array_push($personal_traits_i, ['name'=>$current_p_trait->name, 'type'=> $type, 'environment'=>$environment, 'display_type'=>$display_type, 'desc'=>compensate_wiki_desc($current_p_trait->description), 'availability'=>$availability, 'availability_type'=>$availability_type, 'image'=>$link2]);
                }
            }
        }
        if ($counter % 10 == 0) {
            file_put_contents('personal_traits.txt', number_format($counter*100 / $personal_trait_json_length, 2, ',', ''));
        }
        $counter++;
    }
    unset($link2, $type, $environment, $display_type, $availability, $availability_type, $current_p_trait, $counter);
    file_put_contents('personal_traits.txt', '100,00');

    /* Equipment section */
    $space_equipment_i = [];
    $ground_equipment_i = [];
    $equipment_json = json_decode(file_get_contents($equipment_query));
    $equipment_types_space = [
        'Ship Fore Weapon', 'Ship Aft Weapon', 'Ship Device', 'Hangar Bay', 'Experimental Weapon',
        'Ship Deflector Dish', 'Ship Secondary Deflector', 'Impulse Engine', 'Warp Engine', 'Singularity Engine', 'Ship Shields',
        'Ship Tactical Console', 'Ship Science Console', 'Ship Engineering Console','Ship Weapon', 'Universal Console'
    ];
    $equipment_types_ground = [
        'Kit', 'Body Armor', 'EV Suit', 'Personal Shield', 'Ground Weapon', 'Ground Device', 'Kit Module'
    ];
    //$rarities = ['Epic','Ultra Rare','Very Rare','Rare','Uncommon','Common'];
    $equipment_json_length = count($equipment_json);
    $counter = 0;

    foreach($equipment_json as $current_equip) {
        if (!$current_equip->name == '' && (in_array($current_equip->type, $equipment_types_space) || in_array($current_equip->type, $equipment_types_ground)) && !str_contains($current_equip->name, 'Hangar - Advanced') && !str_contains($current_equip->name, 'Hangar - Elite')) {
            $c_name = $current_equip->name;
            if (str_contains($c_name, ' mk')) {
                $c_name = substr($c_name, 0, strpos($c_name, ' mk'));
            }
            if (str_contains($c_name, ' Mk')) {
                $c_name = substr($c_name, 0, strpos($c_name, ' Mk'));
            }
            if (str_contains($c_name, ' MK')) {
                $c_name = substr($c_name, 0, strpos($c_name, ' MK'));
            }
            if (str_contains($c_name, ' ∞')) {
                $c_name = substr($c_name, 0, strpos($c_name, ' ∞'));
            }
            if (str_contains($c_name, ' [')) {
                $c_name = substr($c_name, 0, strpos($c_name, ' ['));
            }
            if (str_contains($c_name, ' &#91;')) {
                $c_name = substr($c_name, 0, strpos($c_name, ' &#91;'));
            }
            if (str_contains($c_name, ' %5B')) {
                $c_name = substr($c_name, 0, strpos($c_name, ' %5B'));
            }
            $display_type = $current_equip->type == 'Hangar Bay' ? 'Hangar Pet' : ($current_equip->type == 'Warp Engine' ? 'Warp Core' : ($current_equip->type == 'Singularity Engine' ? 'Singularity Core' : str_replace('Ship ', '', $current_equip->type)));
            $description = ['head'=>[], 'subhead'=>[], 'text'=>[]];
            $description2 = '';
            for ($i = 1; $i<10; $i++) {
                $description['head'][$i] = compensate_wiki_desc($current_equip->{'head' . $i});
                $description['subhead'][$i] = compensate_wiki_desc($current_equip->{'subhead' . $i});
                $description['text'][$i] = compensate_wiki_desc($current_equip->{'text' . $i});
                $description2 = $description2 . $description['head'][$i] . $description['subhead'][$i] . $description['text'][$i];
            }
            $current_item_object = [
                'name' => compensate_wiki_desc(str_replace('"', "''", str_replace('&amp;', '&', str_replace('&#34;', "''", str_replace('&quot;', '"', str_replace(':', '', $c_name)))))),
                'url' => $wiki_base . compensate_url($current_equip->Page) . '#' . compensate_url($c_name),
                'type' => $current_equip->type,
                'display_type' => $display_type,
                'desc' => $description,
                'desc2' => $description2,
                'rarity' => is_null($current_equip->rarity) ? '' : strtolower($current_equip->rarity),
                'image' => follow_redirect($image_url . compensate_url(str_replace(' ', '_', $c_name)) . $image_suffix)
            ];
            if (in_array($current_equip->type, $equipment_types_space)) {
                array_push($space_equipment_i, $current_item_object);
            }
            elseif (in_array($current_equip->type, $equipment_types_ground)) {
                array_push($ground_equipment_i, $current_item_object);
            }
        }
        if ($counter % 10 == 0) {
            file_put_contents('equipment.txt', number_format($counter*100 / $equipment_json_length, 2, ',', ''));
        }
        $counter++;
    }
    unset($current_equip, $c_name, $display_type, $description, $description2, $counter);
    file_put_contents('equipment.txt', '100,00');

    $res = json_encode([
        'starship_traits' => $starship_trait_i,
        'personal_traits' => $personal_traits_i,
        'space_equipment' => $space_equipment_i,
        'ground_equipment' => $ground_equipment_i
    ], JSON_UNESCAPED_SLASHES);
    file_put_contents('vger-data.json', $res);

    file_put_contents('date.txt', strval(time()));

    //$end = hrtime(true);
    //file_put_contents('time.txt', number_format(($end - $start) / 1000000000, 2, ',', ''));

    file_put_contents('status.txt', 'Script Idle.');
    
    //file_put_contents('out.txt', json_encode($starship_trait_json[37]));






    /*header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Content-Disposition: attachment; filename='.$req);
    header('Access-Control-Allow-Origin: http://localhost:5173');
    readfile($image_path);*/
?>