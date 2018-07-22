/**
 * 入口文件
 * @author wdzxc
 */
import $wd from '../packages/utils';
import FileUploader from '../packages/upload';
import InterfaceProxy from '../packages/interface-proxy';

$wd.FileUploader = FileUploader;
$wd.InterfaceProxy = InterfaceProxy;

if (window) {
    window.$wd = $wd;
    window.FileUploader = FileUploader;
    window.InterfaceProxy = InterfaceProxy;
}

export default $wd;
export {
    $wd,
    FileUploader,
    InterfaceProxy,
}

