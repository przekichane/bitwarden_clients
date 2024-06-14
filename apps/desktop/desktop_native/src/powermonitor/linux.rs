use std::borrow::Cow;

use napi::{threadsafe_function::{ErrorStrategy::CalleeHandled, ThreadsafeFunction}, tokio};
use zbus::{Connection, MatchRule, export::futures_util::TryStreamExt};

struct ScreenLock {
    interface: Cow<'static, str>,
    path: Cow<'static, str>,
}

const SCREEN_LOCK_MONITORS: [ScreenLock; 2] = [
    ScreenLock {
        interface: Cow::Borrowed("org.gnome.ScreenSaver"),
        path: Cow::Borrowed("/org/gnome/ScreenSaver"),
    },
    ScreenLock {
        interface: Cow::Borrowed("org.freedesktop.ScreenSaver"),
        path: Cow::Borrowed("/org/freedesktop/ScreenSaver"),
    },
];

pub async fn on_lock(callback: ThreadsafeFunction<(), CalleeHandled>) -> Result<(), Box<dyn std::error::Error>> {
    let connection = Connection::session().await?;

    let proxy = zbus::fdo::DBusProxy::new(&connection).await?;
    for monitor in SCREEN_LOCK_MONITORS.iter() {
        let match_rule = MatchRule::builder()
            .msg_type(zbus::MessageType::Signal)
            .interface(String::from(monitor.interface.clone()))?
            .member("ActiveChanged")?
            .build();
        proxy.add_match_rule(match_rule).await?;
    }

    tokio::spawn(async move {
        while let Ok(Some(_)) = zbus::MessageStream::from(&connection).try_next().await {
            callback.call(Ok(()), napi::threadsafe_function::ThreadsafeFunctionCallMode::NonBlocking);
        }
    });

    Ok(())
}

pub async fn is_lock_monitor_available() -> bool {
    let connection = Connection::session().await.unwrap();
    for monitor in SCREEN_LOCK_MONITORS.iter() {
        let res = connection.call_method(Some(String::from(monitor.interface.clone())), String::from(monitor.path.clone()), Some(String::from(monitor.interface.clone())), "GetActive", &()).await;
        if res.is_ok() {
            return true;
        }
    }
    false
}