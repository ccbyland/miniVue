export function queueWatcher(watcher) {

    if(watcher.before){
        watcher.before();
    }
    watcher.run();
}