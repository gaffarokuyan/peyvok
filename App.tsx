import { useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { WebView } from 'react-native-webview';

SplashScreen.preventAutoHideAsync().catch(() => {});

const GAME = require('./assets/web/game.html');

// Android back: go back to the home screen inside the game if possible, otherwise leave the app.
const BACK_JS = `(function(){
  var post = function(m){ window.ReactNativeWebView.postMessage(m); };
  var layer = document.getElementById('layer');
  if (layer && layer.innerHTML.trim()) { layer.innerHTML = ''; return post('handled'); }
  var home = document.getElementById('home');
  if (home && home.classList.contains('show')) return post('exit');
  var hb = document.getElementById('homeBtn');
  if (hb && document.getElementById('game').classList.contains('show')) { hb.click(); return post('handled'); }
  var nb = document.querySelector('#done.show .btn3d');
  if (nb) { var h = document.getElementById('homeBtn'); if (h) h.click(); return post('handled'); }
  post('exit');
})(); true;`;

export default function App() {
  const [uri, setUri] = useState<string | null>(null);
  const web = useRef<WebView>(null);

  useEffect(() => {
    Asset.loadAsync(GAME).then(([a]) => setUri(a.localUri ?? a.uri));
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      web.current?.injectJavaScript(BACK_JS);
      return true;
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      {uri && (
        <WebView
          ref={web}
          source={{ uri }}
          style={styles.root}
          originWhitelist={['*']}
          allowFileAccess
          allowFileAccessFromFileURLs
          allowUniversalAccessFromFileURLs
          domStorageEnabled
          javaScriptEnabled
          mediaPlaybackRequiresUserAction={false}
          overScrollMode="never"
          bounces={false}
          setSupportMultipleWindows={false}
          textZoom={100}
          onLoadEnd={() => SplashScreen.hideAsync().catch(() => {})}
          onMessage={(e) => { if (e.nativeEvent.data === 'exit') BackHandler.exitApp(); }}
          onShouldStartLoadWithRequest={(r) => r.url.startsWith('file://') || r.url.startsWith('about:') || r.url.startsWith('data:')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#2b2249' } });
