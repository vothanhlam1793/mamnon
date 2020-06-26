function video_hls(id_video, url_video) {
    var video = document.getElementById(id_video);
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url_video);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url_video;
        video.addEventListener('canplay', function () {
            video.play();
        });
    } else {
        alert("Trình duyệt không hỗ trợ - Bạn nên sử dụng Chrome để hệ thống hoạt động tốt hơn")
        console.log("Notthing");
    }
}
Vue.component("view-camera", {
    props: ['id_video', 'title_video', 'alias_camera'],
    data: function () {
        return {

        }
    },
    methods:{
        start_camera: function(){
            console.log("ALIAS:")
        }
    },
    template: `
        <div class="text-center">
            <video :id="id_video" width="100%" controls></video>
            <label style='padding-top: 10px'>{{title_video}}</label>
        </div>            
    `
});