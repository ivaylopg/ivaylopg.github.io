(function(d) {
  var timedOut = function(){
      // console.log("timed out");
      var fallBackFont = document.createElement('link');
      fallBackFont.rel = "stylesheet";
      fallBackFont.href = "fonts/firaSans.min.css";
      document.head.appendChild(fallBackFont);
  }
  //nsg2nrd
  var config = {
    kitId: 'nsg2nrd',
    scriptTimeout: 3000,
    async: true,
    loading: function() {
      // console.log("loading");
    },
    active: function() {
      // console.log("loaded");
    },
    inactive: function() {
      // console.log("no-dice");
      timedOut();
    }
  },
  h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";timedOut()},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='//use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){console.log()}};s.parentNode.insertBefore(tk,s)
})(document);
