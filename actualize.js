!function(){
	if(window['__actualize.js'])return;window['__actualize.js']=1;
	var actual = "https://api.kinogram.best"
		,ignore,last = 'https://api.synchroncode.com'
		,re=/^https?:\/\/(?:mm|app?i\w*)\.(delivembed\.cc|buildplayer\.com|embedstorage\.net|mir-dikogo-zapada\.com|multikland\.net|placehere\.link|synchroncode\.com|ameytools\.club|tobaco\.ws|topdbltj\.ws)/
		,delay=200
		,dry=[]
		,MS = window.MediaSource || window['WebKitMediaSource']
		,ios=~navigator.userAgent.indexOf('iPhone')
		,ral;
	if(window.fetch&&!ios) {
		function pass(){ral = 1}
		head('https://test.takedwn.ws/ping').catch(pass);
		if(/club$/.test(location.hostname))head('https://cdn.jsdelivr.net/npm/venom-player').catch(pass);
	}
	new Image().src = "https://stats.myangular.life/player?hit=script&sub=actualize&host=" + location.hostname;
	replace();
	function findFrame(fn){
		if(document.body)return Array.prototype.find.call(document.body.getElementsByTagName('iframe'),fn);
	}
	function replace(){
		setTimeout(replace,delay++);
		var old,src,ds,i=findFrame(function(f){
			src=f.src;
			if(!src&&(ds=f.dataset)){
				if(/\blazyload\b/.test(f.className)&&ds.src){
					old=ds.src.match(re);
					if(old)ds.src=ds.src.replace(old[0],'https://api.'+old[1])
				}if(/\blazyload(ed|ing)\b/.test(f.className))src=ds.src;
			}
			return old=src&&src.indexOf(actual)&&dry.indexOf(src)===-1&&src.match(re)
		});
		if (!i ||i.offsetWidth===0||old[0]==ignore) return;
		dry.push(src);
		var f=function(){
			var url = src.replace(old[0], actual);
			get(url, function(r){
				if(ral===1)return;
				var up=update(i,r);
				dry=[];
				if(window.URL){
					url=new URL(url);
					url.searchParams.delete('episode');
				}
				addEventListener('message',function(e){
					if(e.origin==location.origin&&e.data=='reActualizeMe'&&up.contentWindow==e.source)
						get(url,function(r){up=update(up,r);})
				})
			})
		};
		if ((ios&&'https:'==location.protocol)
			||(!MS&&(navigator.serviceWorker||(!ios&&'http:'==location.protocol)))) {
			head(last + '/ping/').then(function () {
				i.src = src.replace(old[0], last);
				dry = [];
				ignore=last;
			}).catch(f);
		} else f();
	}
	function update(old,w){
		var up=document.createElement('iframe');
		copyAttr(old,up);
		up.setAttribute('allow', 'autoplay *; fullscreen');
		up.allow = 'autoplay *; fullscreen';
		old.parentElement.replaceChild(up,old);
		up.contentDocument.write(w);
		up.contentDocument.close();
		return up;
	}
	function copyAttr(from,to){
		var attrs=from.attributes;
		for(var name,i=0;i<attrs.length;i++){
			name = attrs[i].name;
			if(name!='src'&&name!='data-src'&&/^[\w\-]+$/.test(name))
				to.setAttribute(name,attrs[i].value);
		}
	}
	function get(url, cb) {
		var xhr = new XMLHttpRequest;
		xhr.withCredentials = true;
		xhr.open('GET', url);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) cb(xhr.response);
		};
		xhr.send();
	}
	function head(u) {
		return fetch(u,{method:'head'});
	}
}()
