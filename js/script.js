$(document).ready(function() {
	SetupDatePicker();
	SetupVars();
	SetupColorPickers();
	SetupBadges();
	SetupCountryFlags();
	SetupEditables();
	SetupColorOptions();
	RegenerateCopyright();	
});

/* Defaults */
var tmpStorage = $('<div></div>');
var currentGradientColor1 = '#c9c7c9';
var currentGradientColor2 = '#9e9c9e';
var badgesUrl = 'http://www.dmca.com/jsonp/badges';
var currentLinkBackImageUrl = 'https://az25533.vo.msecnd.net/assets/icons/copyrightbar.com.png';
var currentBorderColor = 'border: 1px solid #ccc;';
var solidBackgroundColor = 'background: #efefef;';
var currentBackgroundColor = '';
var currentTextColor = 'color: white;';
var backgroundColorType = '';
var currentProtectionStatusLink = '#';
var selectedCountryFlag = '';

/* Vars */
var companyName;
var copyrightStartDate;
var includeAllRightsReserved;
var includeProtectionBadge;
var includeCountryFlag;
var websiteUrl;
var disableRightClick;
var stylesheet = [];


function RegenerateCopyright() {
	GenerateCopyright(false);
	GenerateCopyright(true);
}

function GenerateBadge(imageUrl, plink) {
	var tmpImg = $('<div><img src="' + imageUrl + '" /></div>');
	tmpImg.find('img').data('plink', plink);
	$('.protection-badges').append(tmpImg);
}

function SetupBadges() {
	$.ajax({
		url: badgesUrl,
		crossDomain: true,
		jsonpCallback: 'images',
		dataType: 'jsonp',
		success: function(data) {
			$.each(data, function (i, v) {
				GenerateBadge(v.ImageUrl, v.ProtectionStatusLink);
			});

			$('.protection-badges img').on('click', function() {
				$('.protection-badges .selected').removeClass('selected');
				$(this).addClass('selected');
				currentLinkBackImageUrl = $(this).attr('src');
				currentProtectionStatusLink = $(this).data('plink');
				$('.current-selected-badge img').attr('src', currentLinkBackImageUrl);
				RegenerateCopyright();
			});

			$('.protection-badges img').first().trigger('click');
		}
	});

	$('.include-protection-badge').on('click', function() {
		if($(this).is(':checked')) {
			includeProtectionBadge = true;
			$('.protection-badges-line').fadeIn();
		} else {
			includeProtectionBadge = false;
			$('.protection-badges-line').fadeOut();
		}
	});

	$('.close-badges-trigger').on('click', function() {
		$('.badges').fadeOut();
		return null;
	});

	$('.select-badge-trigger').on('click', function() {
		$('.badges').fadeIn();
		return null;
	});

}

function SetupCountryFlags() {
	$('.country-flags').load('/footer-maker/flags/flags.php', function() {
		$('.country-flags div').on('click', function() {
			$('.country-flags .selected').removeClass('selected');
			$(this).addClass('selected');
			selectedCountryFlag = $(this).find('img');
			$('.current-selected-flag').append($(this).find('img'));
			RegenerateCopyright();
		});

		$('.country-flags div').first().trigger('click');
	});

	$('.include-country-flag').on('click', function() {
		if($(this).is(':checked')) {
			includeCountryFlag = true;
			$('.country-flag-line').fadeIn();
		} else {
			includeCountryFlag = false;
			$('.country-flag-line').fadeOut();
		}
	});

	$('.close-country-flags-trigger').on('click', function() {
		$('.flags').fadeOut();
		return null;
	});

	$('.select-country-flag-trigger').on('click', function() {
		$('.flags').fadeIn();
		return null;
	});
}

/* Functions */
function SetupEditables() {
	$('.editable').on('change', function() {
		SetupVars();
		RegenerateCopyright();
	});
}

function ProcessStylesheet() {
	var resultingCss = '';

	if(stylesheet != null && stylesheet.length > 0) {
		resultingCss = '<style>';

		$.each(stylesheet, function(i ,v){
			resultingCss += v.class + '{' + v.attribute + '}';
		});
		resultingCss += '</style>';
	}

	return resultingCss;
}

function AddStyle(cssClass, attribute) {
	var isAlreadyAdded = false;

	for(i = 0; i < stylesheet.length; i++) {
		if(stylesheet[i].class == cssClass) {
			stylesheet[i].attribute = attribute;
			isAlreadyAdded = true;
			break;
		} 
	}

	if(!isAlreadyAdded) {
		stylesheet.push({'class' : cssClass,
					'attribute' : attribute});
	}
}

function SetupDatePicker() {
	for(i = 1970; i <= new Date().getFullYear(); i++) {
		if(i == new Date().getFullYear() - 1) {
			var selected = 'selected="selected"';
		} else {
			var selected = '';
		}

		$('.copyright-start-date').append('<option ' + selected + '>' + i + '</option>');
	}
}

function SetupVars() {
	companyName = $('.company-name').val() != '' ? $('.company-name').val() : '[Company Name]';
	copyrightStartDate = $('.copyright-start-date').val() != '' ? $('.copyright-start-date').val() : '[Copyright Start Date]';
	includeAllRightsReserved = $('.all-rights-reserved').is(':checked');
	includeProtectionBadge = $('.include-protection-badge').is(':checked');
	includeCountryFlag = $('.include-country-flag').is(':checked');
	websiteUrl = $('.website-url').val().indexOf('http://') == -1 ?  'http://' + $('.website-url').val() : $('.website-url').val();
	disableRightClick = $('.disable-right-click').is(':checked');
}

function GenerateCopyright(isCode) {
	var copyright = '';

	if(!isCode) {
		var yearCodeForBar = new Date().getFullYear();
	} else {
		var yearCodeForBar = '<script type="text/javascript">document.write(new Date().getFullYear());</script>';
	}


	copyright += 'Copyright <a href="' + websiteUrl + '">' + companyName + '</a> - ' + copyrightStartDate + ' - ' + yearCodeForBar + '. ';

	if(includeAllRightsReserved) {
		copyright += 'All rights reserved. ';
	}

	var protectionBadge = '';
	if(includeProtectionBadge) {
		protectionBadge = '<a href="' + currentProtectionStatusLink + '" target="_blank"><img class="badge-image" src="' + currentLinkBackImageUrl + '" alt="CopyrightBar.com" /></a>';
	}

	var countryFlag = '';
	if(includeCountryFlag) {
		countryFlag = selectedCountryFlag;
	}

	var scriptToDisableRightClick = '';
	if(disableRightClick && isCode) {
		scriptToDisableRightClick = '<script type="text/javascript">document.addEventListener("contextmenu", function(e){e.preventDefault(); alert("Page is protected by CopyrightRighBar.com")}, false);</script>';
	}

	var linkbackImage = '<a href="http://copyrightbar.com" target="_blank"><img class="linkback-image" src="https://az25533.vo.msecnd.net/assets/icons/dmca.com.png" alt="CopyRightBar.com" title="CopyRightBar.com" /></a>'

	if(backgroundColorType === 'gradient') {
		currentBackgroundColor = GetGradient() + ';';
	} else {
		currentBackgroundColor = 'background: #' + hex + ';';
	}

	AddStyle('.dmca-footer', currentBorderColor + currentTextColor + currentBackgroundColor);
	AddStyle('.linkback-image', 'height:32px;float:left;margin-top:-10px;margin-left:-5px;');
	AddStyle('.badge-image', 'height:32px;float:right;margin-top:-10px;margin-right:-5px;');

	var container = $('<div class="dmca-footer" id="dmcaFooter" style="margin: 10px 0px; padding: 15px; font-size: 12px; text-align: center;"></div>');
	container.prepend(scriptToDisableRightClick);
	container.append(ProcessStylesheet() + protectionBadge + countryFlag + linkbackImage  + copyright);
	
	if(!isCode) {
		$('.footer-maker-output').html(container);
	} else {
		var tmpContainer = $('<div />');
		tmpContainer.append(container);
		$('.dmca-footer-code textarea').val(tmpContainer.html());
	}
 	
}

function GetGradient() {
	return 'background: ' + currentGradientColor1 + ';background: -moz-linear-gradient(top, ' + currentGradientColor1 + ' 0%, ' + currentGradientColor2 + ' 100%);background: -webkit-gradient(left top, left bottom, color-stop(0%, ' + currentGradientColor1 + '), color-stop(100%, ' + currentGradientColor2 + '));background: -webkit-linear-gradient(top, ' + currentGradientColor1 + ' 0%, ' + currentGradientColor2 + ' 100%);background: -o-linear-gradient(top, ' + currentGradientColor1 + ' 0%, ' + currentGradientColor2 + ' 100%);background: -ms-linear-gradient(top, ' + currentGradientColor1 + ' 0%, ' + currentGradientColor2 + ' 100%);background: linear-gradient(to bottom, ' + currentGradientColor1 + ' 0%, ' + currentGradientColor2 + ' 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'' + currentGradientColor1 + '\', endColorstr=\'' + currentGradientColor2 + '\', GradientType=2 );'
}

function SetupColorPickers() {
	$('.solid-background-color-picker').ColorPicker({
		color: '#efefef',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('.solid-background-color-picker div').css('backgroundColor', '#' + hex);
			solidBackgroundColor = hex;
			RegenerateCopyright();
		}
	});

	$('.gradient-background-color-picker-1').ColorPicker({
		color: currentGradientColor1,
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('.gradient-background-color-picker-1 div').css('backgroundColor', '#' + hex);
			currentGradientColor1 = '#' + hex;
			RegenerateCopyright();
		}
	});

	$('.gradient-background-color-picker-2').ColorPicker({
		color: currentGradientColor2,
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('.gradient-background-color-picker-2 div').css('backgroundColor', '#' + hex);
			currentGradientColor2 = '#' + hex;
			RegenerateCopyright();
		}
	});

	$('.gradient-background-color-picker-1 div').css('backgroundColor', currentGradientColor1);
	$('.gradient-background-color-picker-2 div').css('backgroundColor', currentGradientColor2);

	$('.border-color-picker').ColorPicker({
		color: '#ccc',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('.border-color-picker div').css('backgroundColor', '#' + hex);
			currentBorderColor = 'border: 1px solid #' + hex + ';';
			RegenerateCopyright();
		}
	});

	$('.text-color-picker').ColorPicker({
		color: '#333',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('.text-color-picker div').css('backgroundColor', '#' + hex);
			currentTextColor = 'color: #' + hex + ';';
			RegenerateCopyright();
		}
	});
}

function SetupColorOptions() {
	$('.color-option-container').hide();
	$('.' + $('.color-options input:checked').val() + '-color-option').fadeIn();
	backgroundColorType = $('.color-options input:checked').val();

	$('.color-options input').on('click', function() {
		$('.color-option-container').hide();
		backgroundColorType = $('.color-options input:checked').val();
		$('.' + $(this).val() + '-color-option').fadeIn();
	})
}