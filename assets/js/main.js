const database = "../db/main.json";
let config = "";
let picked_lang = "en";
let allowed_lang = ["en", "sk"];
let translate = "";
let hostHead = window.location.host;
$(document).ready(() => {
    $.getJSON(database, function (raw_config) {
        config = raw_config.config;
    });

    if (localStorage.getItem('hoomer_lang')) {
        if (allowed_lang.includes(localStorage.getItem('hoomer_lang'))) {
            picked_lang = localStorage.getItem('hoomer_lang');
        } else {
            localStorage.setItem('hoomer_lang', 'en');
            picked_lang = "en";
        }
    } else {
        localStorage.setItem('hoomer_lang', 'en');
        picked_lang = "en";
    }
    $('#picker_wrap').html($('#picker_' + picked_lang).html());
    GetTranslate();
    GetAllResources();
})

function SwitchTemplate() {
    switch (config.color_palette) {
        case "dark":
            $('.navbar').attr('data-bs-theme', "dark");
            $('#picker_wrap').removeClass('btn-outline-dark');
            $('#picker_wrap').addClass('btn-outline-secondary');
            $('.card-header').removeClass('bg-secondary');
            $('.card-header').addClass('bg-dark');
            break;
        default:
            $('.navbar').attr('data-bs-theme', "secondary");
            $('#picker_wrap').removeClass('btn-outline-secondary');
            $('#picker_wrap').addClass('btn-outline-dark');
            $('.card-header').removeClass('bg-dark');
            $('.card-header').removeClass('text-white');
            break;

    }
}

function GetTranslate() {
    $.getJSON("../lang/" + picked_lang + ".json", function (raw_translate) {
        translate = raw_translate;
        $('.lang_en').text(raw_translate.lang_en);
        $('.lang_sk').text(raw_translate.lang_sk);
        $('#search_form').prop("placeholder", raw_translate.search_input_place);
    });
}

function SelectLang(lang) {
    event.preventDefault();
    if (lang) {
        if (allowed_lang.includes(lang)) {
            localStorage.setItem('hoomer_lang', lang);

            picked_lang = lang
            GetTranslate();
            GetAllResources();
            $('#picker_wrap').html($('#picker_' + picked_lang).html());
        }
    }
}

async function GetAllResources(search_value = null) {
    try {
        const response = await fetch(database);
        const data = await response.json();
        let resources = data.resources;
        let main_text = "";
        if (resources.length > 0) {
            resources.forEach((item) => {
                    var domain = new URL(item.url).hostname.replace('www.', '');
                    //Filtering data
                    if (search_value == null) {
                        main_text += '<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-2" onclick="window.open(\'' + item.url + '\', \'_blank\')"><div class="card text-center"><div class="card-header text-white">' + item.name + '</div><div class=card-body><div class="media mb-2"><div class=mr-3><img alt="Placeholder image" class=rounded-circle height=70 src="https://logo.clearbit.com/' + domain + '" width=70></div></div><h5 class=card-title>@' + item.tag + '</h5><p class=card-text>' + item.desc + '</p></div><div class="card-footer text-body-secondary">' + translate.open_on_new_card + ': ' + domain.charAt(0).toUpperCase() + domain.slice(1) + '</div></div></div>';
                    } else {
                        if (item.name.toUpperCase().startsWith(search_value.toUpperCase()) || item.tag.toUpperCase().startsWith(search_value.toUpperCase().replace('@', '')) || domain.toUpperCase().startsWith(search_value.toUpperCase())) {
                            main_text += '<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-2" onclick="window.open(\'' + item.url + '\', \'_blank\')"><div class="card text-center"><div class="card-header text-white">' + item.name + '</div><div class=card-body><div class="media mb-2"><div class=mr-3><img alt="Placeholder image" class=rounded-circle height=70 src="https://logo.clearbit.com/' + domain + '" width=70></div></div><h5 class=card-title>@' + item.tag + '</h5><p class=card-text>' + item.desc + '</p></div><div class="card-footer text-body-secondary">' + translate.open_on_new_card + ': ' + domain.charAt(0).toUpperCase() + domain.slice(1) + '</div></div></div>';
                        }
                    }
                }
            )
        } else {
            main_text = "Žiadne dáta";
        }
        $('#main_resources_wrap').html(main_text);
        SwitchTemplate();
    } catch
        (error) {
        console.log(error);
    }
}

$('#search_form').on('focusout', () => {
    $('#search_form').addClass('w-25');
    $('#search_form').removeClass('w-100');
    $('#search_form').prop('placeholder', translate.search_input_place);
})
$('#search_form').on('focusin', () => {
    $('#search_form').removeClass('w-25');
    $('#search_form').addClass('w-100');
    $('#search_form').prop('placeholder', translate.search_input);
})

var timeout = null;
var firstShift = false;

$(document).on("keydown", function(e) {
    if (e.shiftKey && e.which === 16) {
        if (firstShift) {
            clearTimeout(timeout);
            timeout = null;
            $("#search_form").focus();
            firstShift = false;
        } else {
            firstShift = true;
            timeout = setTimeout(function() {
                firstShift = false;
                timeout = null;
            }, 1500);
        }
    }
});

