import { useEffect, useRef, useState, type ComponentType, type Ref } from 'react';
import { AppState, BackHandler, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

SplashScreen.preventAutoHideAsync().catch(() => {});

// react-native-webview 14 typings resolve WebView props to `never` against RN 0.88 types; the runtime is fine.
const WebViewC = WebView as unknown as ComponentType<Record<string, unknown> & { ref?: Ref<WebView> }>;

const GAME = require('./assets/web/game.html');
const BG = '#0b0910';

// Store / ad flags read by the game. Flip to true once Play Billing / AdMob are wired below.
const NATIVE_FLAGS = `window.KAWA_NATIVE={iap:false,ads:false};true;`;

// Android back: close sheet -> pause game -> resume -> leave app from home.
const BACK_JS = `(function(){var r=window.__kawaBack?window.__kawaBack():'exit';
  window.ReactNativeWebView.postMessage(JSON.stringify({type:'back',result:r}));})();true;`;

export default function App() {
  const [uri, setUri] = useState<string | null>(null);
  const web = useRef<WebView>(null);

  useEffect(() => {
    Asset.loadAsync(GAME).then(([a]) => setUri(a.localUri ?? a.uri));
  }, []);

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      web.current?.injectJavaScript(BACK_JS);
      return true;
    });
    const app = AppState.addEventListener('change', (s) => {
      if (s !== 'active') web.current?.injectJavaScript('window.__kawaPause&&window.__kawaPause();true;');
    });
    return () => { back.remove(); app.remove(); };
  }, []);

  const onMessage = (e: WebViewMessageEvent) => {
    let msg: { type?: string; result?: string; id?: number } = {};
    try { msg = JSON.parse(e.nativeEvent.data); } catch { return; }
    if (msg.type === 'back' && msg.result === 'exit') BackHandler.exitApp();
    // Not wired yet: answer "not completed" so the game never hangs waiting.
    if ((msg.type === 'iap:buy' || msg.type === 'ad:rewarded') && msg.id != null) {
      web.current?.injectJavaScript(`window.__nativeReply(${msg.id},false);true;`);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      {uri && (
        <WebViewC
          ref={web}
          source={{ uri }}
          style={styles.root}
          originWhitelist={['*']}
          allowFileAccess
          allowFileAccessFromFileURLs
          domStorageEnabled
          javaScriptEnabled
          injectedJavaScriptBeforeContentLoaded={NATIVE_FLAGS}
          mediaPlaybackRequiresUserAction={false}
          overScrollMode="never"
          bounces={false}
          setSupportMultipleWindows={false}
          textZoom={100}
          androidLayerType="hardware"
          onLoadEnd={() => SplashScreen.hideAsync().catch(() => {})}
          onMessage={onMessage}
          onShouldStartLoadWithRequest={(r: { url: string }) => r.url.startsWith('file://') || r.url.startsWith('about:') || r.url.startsWith('data:')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: BG } });
