export default function closeNotice() { 
  notice = document.getElementsByClassName('alert_notice')[0]
  notice.parentNode.removeChild(notice);
}