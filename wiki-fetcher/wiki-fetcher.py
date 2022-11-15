import os
import requests
import json
import html
import urllib

#base URI
wikihttp = 'https://sto.fandom.com/wiki/'
wikiImages = wikihttp+'Special:Filepath/'

#query for ship cargo table on the wiki
ship_query = wikihttp+"Special:CargoExport?tables=Ships&&fields=_pageName%3DPage%2Cname%3Dname%2Cimage%3Dimage%2Cfc%3Dfc%2Ctier%3Dtier%2Ctype__full%3Dtype%2Chull%3Dhull%2Chullmod%3Dhullmod%2Cshieldmod%3Dshieldmod%2Cturnrate%3Dturnrate%2Cimpulse%3Dimpulse%2Cinertia%3Dinertia%2Cpowerall%3Dpowerall%2Cpowerweapons%3Dpowerweapons%2Cpowershields%3Dpowershields%2Cpowerengines%3Dpowerengines%2Cpowerauxiliary%3Dpowerauxiliary%2Cpowerboost%3Dpowerboost%2Cboffs__full%3Dboffs%2Cfore%3Dfore%2Caft%3Daft%2Cequipcannons%3Dequipcannons%2Cdevices%3Ddevices%2Cconsolestac%3Dconsolestac%2Cconsoleseng%3Dconsoleseng%2Cconsolessci%3Dconsolessci%2Cuniconsole%3Duniconsole%2Ct5uconsole%3Dt5uconsole%2Cexperimental%3Dexperimental%2Csecdeflector%3Dsecdeflector%2Changars%3Dhangars%2Cabilities__full%3Dabilities%2Cdisplayprefix%3Ddisplayprefix%2Cdisplayclass%3Ddisplayclass%2Cdisplaytype%3Ddisplaytype%2Cfactionlede%3Dfactionlede&&order+by=`_pageName`%2C`name`%2C`image`%2C`fc`%2C`faction__full`&limit=2500&format=json"
#query for ship equipment cargo table on the wiki
item_query = wikihttp+'Special:CargoExport?tables=Infobox&&fields=_pageName%3DPage%2Cname%3Dname%2Crarity%3Drarity%2Ctype%3Dtype%2Cboundto%3Dboundto%2Cboundwhen%3Dboundwhen%2Cwho%3Dwho%2Chead1%3Dhead1%2Chead2%3Dhead2%2Chead3%3Dhead3%2Chead4%3Dhead4%2Chead5%3Dhead5%2Chead6%3Dhead6%2Chead7%3Dhead7%2Chead8%3Dhead8%2Chead9%3Dhead9%2Csubhead1%3Dsubhead1%2Csubhead2%3Dsubhead2%2Csubhead3%3Dsubhead3%2Csubhead4%3Dsubhead4%2Csubhead5%3Dsubhead5%2Csubhead6%3Dsubhead6%2Csubhead7%3Dsubhead7%2Csubhead8%3Dsubhead8%2Csubhead9%3Dsubhead9%2Ctext1%3Dtext1%2Ctext2%3Dtext2%2Ctext3%3Dtext3%2Ctext4%3Dtext4%2Ctext5%3Dtext5%2Ctext6%3Dtext6%2Ctext7%3Dtext7%2Ctext8%3Dtext8%2Ctext9%3Dtext9&&order+by=%60_pageName%60%2C%60name%60%2C%60rarity%60%2C%60type%60%2C%60boundto%60&limit=5000&format=json'
#query for personal and reputation trait cargo table on the wiki
trait_query = wikihttp+"Special:CargoExport?tables=Traits&&fields=_pageName%3DPage%2Cname%3Dname%2Cchartype%3Dchartype%2Cenvironment%3Denvironment%2Ctype%3Dtype%2Cisunique%3Disunique%2Cmaster%3Dmaster%2Cdescription%3Ddescription%2Crequired__full%3Drequired%2Cpossible__full%3Dpossible&&order+by=%60_pageName%60%2C%60name%60%2C%60chartype%60%2C%60environment%60%2C%60type%60&limit=2500&format=json"
ship_trait_query = wikihttp+"Special:CargoExport?tables=Mastery&fields=Mastery._pageName,Mastery.trait,Mastery.traitdesc,Mastery.trait2,Mastery.traitdesc2,Mastery.trait3,Mastery.traitdesc3,Mastery.acctrait,Mastery.acctraitdesc&limit=1000&offset=0&format=json"
#query for DOFF types and specializations
doff_query = wikihttp+"Special:CargoExport?tables=Specializations&fields=Specializations.name,Specializations.shipdutytype,Specializations.department,Specializations.description,Specializations.powertype,Specializations.white,Specializations.green,Specializations.blue,Specializations.purple,Specializations.violet,Specializations.gold&order+by=Specializations.name&limit=1000&offset=0&format=json"
#query for Specializations and Reps
reputation_query = wikihttp+'Special:CargoExport?tables=Reputation&fields=Reputation.name,Reputation.environment,Reputation.boff,Reputation.color1,Reputation.color2,Reputation.description,Reputation.icon,Reputation.link,Reputation.released,Reputation.secondary&order+by=Reputation.boff&limit=1000&offset=0&format=json'

base_path =  os.path.dirname(os.path.abspath(__file__))

def uri_sanitize_stowiki(name):
        if isinstance(name, str):
            name = name.replace(' ', '_')
            name = name.replace('/', '_')
            name = name.replace('%26%2339%3B',"527")
            name = name.replace('%C2%A0', '_')
            name = name.replace('%26%2334%3B','%22')
            name = name.replace('&quot;','%22')
            name = name.replace('"','%22')
            name = name.replace("'",'%27')
            name = html.unescape(name)
            name = urllib.parse.quote(name)
        elif not name:
            name = ''
        else:
            name = ''
        return name


def request_json(url, designation):
    filename = base_path+'/json/'+designation+'.json'
    r = requests.get(url)
    json_dict = {'content':r.json()}
    with open(filename, 'w') as json_file:
        json.dump(json_dict, json_file)
    return r.json()

def request_image(designation):
    if os.path.exists(base_path+'/images/'+designation+'.png'):
        return
    else:
        image = requests.get(wikiImages+uri_sanitize_stowiki(designation)+'_icon.png')
        if image.ok:
            with open(base_path+'/images/'+designation+'.png', 'wb') as h:
                h.write(image.content)
                print(designation)
        else:
            print('<<<<<<<<<<<<<<<<<<<< error|'+wikiImages+uri_sanitize_stowiki(designation)+'_icon.png')


if not os.path.exists(os.path.dirname(os.path.abspath(__file__))+'/json'):
    os.makedirs(os.path.dirname(os.path.abspath(__file__))+'/json')
if not os.path.exists(os.path.dirname(os.path.abspath(__file__))+'/images'):
    print('you are insane')
    quit()

ship_traits = request_json(ship_trait_query, 'starship_traits')

for ship in ship_traits:
    if not ship['trait'] == '' and ship['trait'] is not None:
        request_image(ship['trait'])
    if not ship['trait2'] == '' and ship['trait2'] is not None:
        request_image(ship['trait2'])
    if not ship['trait3'] == '' and ship['trait3'] is not None:
        request_image(ship['trait3'])
    if not ship['acctrait'] == '' and ship['acctrait'] is not None:
        request_image(ship['acctrait'])


traits = request_json(trait_query, 'traits')

for trait in traits:
    if not trait['name'] == '' and trait['name'] is not None:
        if not trait['chartype'] == 'boff' and not trait['type'] == 'recruit' and not trait['chartype'] == 'doff':
            request_image(trait['name'])


equipments = request_json(item_query, 'infoboxes')

for item in equipments:
    equipment_types = [
            'Ship Fore Weapon', 'Ship Aft Weapon', 'Ship Device', 'Hangar Bay', 'Experimental',
            'Ship Deflector Dish', 'Ship Secondary Deflector', 'Impulse Engine', 'Warp', 'Singularity', 'Ship Shields',
            'Console', 'Ship Tactical Console', 'Ship Science Console', 'Ship Engineering Console',
            'Kit', 'Body Armor', 'EV Suit', 'Personal Shield', 'Ground Weapon', 'Ground Device', 'Ship Weapon', 'Universal Console'
        ]
    if not item['name'] == '' and item['name'] is not None and item['type'] in equipment_types:
        if ' mk ' in item['name'].lower():
            index = item['name'].lower().find(' mk ')
            name = item['name'][:index]
            request_image(name)
        elif ' ∞' in item['name']:
            index = item['name'].lower().find(' ∞')
            name = item['name'][:index]
            request_image(name)
        elif ' [' in item['name']:
            index = item['name'].lower().find(' [')
            name = item['name'][:index]
            request_image(name)
        elif ' &#91;' in item['name'].lower():
            index = item['name'].lower().find(' &#91;')
            name = item['name'][:index]
            request_image(name)
        elif ' %5B' in item['name']:
            index = item['name'].lower().find(' %5B')
            name = item['name'][:index]
            request_image(name)
        else:
            request_image(item['name'])
    