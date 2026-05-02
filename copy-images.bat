@echo off
REM Copy images from Ilustrations to illustrations folder

set source=C:\Users\jeffthomas\Desktop\Claude Cowork\OUTPUTS\parent-coach-playbook\public\Ilustrations
set target=C:\Users\jeffthomas\Desktop\Claude Cowork\OUTPUTS\parent-coach-playbook\public\illustrations

REM Create target directory
if not exist "%target%" mkdir "%target%"
if not exist "%target%\extras" mkdir "%target%\extras"

REM Copy primary images
copy "%source%\ChatGPT Image May 1, 2026, 06_51_01 AM.png" "%target%\three-drives-one-relationship.png"
copy "%source%\ChatGPT Image May 1, 2026, 06_51_14 AM.png" "%target%\the-real-job-of-youth-sports.png"
copy "%source%\ChatGPT Image May 1, 2026, 06_51_20 AM.png" "%target%\the-missing-rec-layer.png"
copy "%source%\ChatGPT Image May 1, 2026, 06_53_44 AM.png" "%target%\the-90-second-rule.png"
copy "%source%\ChatGPT Image May 1, 2026, 06_55_24 AM.png" "%target%\on-not-making-varsity.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_14_47 AM.png" "%target%\coaching-your-own-kid-in-front-of-the-team.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_15_06 AM.png" "%target%\the-90-second-rule-alt2.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_15_11 AM.png" "%target%\on-not-making-varsity-alt2.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_15_13 AM.png" "%target%\on-not-making-varsity-alt3.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_15_18 AM.png" "%target%\your-kid-is-the-worst-on-the-team.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_15_19 AM.png" "%target%\your-kid-is-the-worst-on-the-team-alt2.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_16_27 AM.png" "%target%\coaching-your-own-kid-in-front-of-the-team-alt2.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_17_43 AM.png" "%target%\the-missing-rec-layer-alt2.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_21_41 AM.png" "%target%\what-my-kid-said-in-the-car.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_21_49 AM.png" "%target%\what-my-kid-said-in-the-car-alt2.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_23_20 AM.png" "%target%\night-before-tryouts.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_32_12 AM.png" "%target%\night-before-tryouts-alt2.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_34_48 AM.png" "%target%\the-night-before-tryouts-5-to-7.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_37_40 AM.png" "%target%\practice-plan-parents-can-read.png"
copy "%source%\ChatGPT Image May 1, 2026, 07_40_04 AM.png" "%target%\the-hard-parent-email-script.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_30_27 AM.png" "%target%\the-fair-substitution-rule.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_30_36 AM.png" "%target%\the-hard-parent-email-script-alt2.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_30_54 AM.png" "%target%\camps-submission-cta.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_31_02 AM.png" "%target%\camps-phase-2-hero.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_33_49 AM.png" "%target%\cones-drill.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_36_19 AM.png" "%target%\tee-ball-drill.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_37_53 AM.png" "%target%\soccer-dribbling.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_40_42 AM.png" "%target%\whistle-still-life.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_44_21 AM.png" "%target%\practice-huddle.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_46_38 AM.png" "%target%\drive-there-divider.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_47_57 AM.png" "%target%\game-divider.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_49_01 AM.png" "%target%\camps-divider.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_51_25 AM.png" "%target%\what-my-kid-said-in-the-car-alt3.png"
copy "%source%\ChatGPT Image May 1, 2026, 08_52_46 AM.png" "%target%\the-night-before-tryouts-5-to-7-alt2.png"

REM Copy extras
copy "%source%\ChatGPT Image May 1, 2026, 06_50_13 AM.png" "%target%\extras\"
copy "%source%\ChatGPT Image May 1, 2026, 07_15_00 AM.png" "%target%\extras\"
copy "%source%\ChatGPT Image May 1, 2026, 07_24_59 AM.png" "%target%\extras\"
copy "%source%\ChatGPT Image May 1, 2026, 07_26_50 AM.png" "%target%\extras\"
copy "%source%\ChatGPT Image May 1, 2026, 07_26_54 AM.png" "%target%\extras\"

echo Done!
