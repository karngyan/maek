type LogoMaekProps = {
  type: 'square' | 'text' | 'square-transparent' | 'full'
  className?: string
}

export default function LogoMaek({ className, type }: LogoMaekProps) {
  switch (type) {
    case 'full':
      return (
        <svg
          viewBox='0 0 1538 295'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            d='M322.945 257V95H372.145L373.645 122.9H376.045C379.845 112.5 386.045 104.8 394.645 99.8C403.445 94.6 413.045 92 423.445 92C434.445 92 444.545 94.6 453.745 99.8C462.945 105 469.745 114.1 474.145 127.1H476.545C480.145 115.3 486.645 106.5 496.045 100.7C505.645 94.9 516.445 92 528.445 92C538.845 92 548.145 94.2 556.345 98.6C564.545 102.8 571.045 109.8 575.845 119.6C580.845 129.4 583.345 142.4 583.345 158.6V257H532.645V169.7C532.645 161.5 531.745 154.7 529.945 149.3C528.345 143.9 525.645 139.9 521.845 137.3C518.245 134.5 513.445 133.1 507.445 133.1C501.245 133.1 495.945 134.7 491.545 137.9C487.345 141.1 484.145 145.2 481.945 150.2C479.745 155.2 478.645 160.5 478.645 166.1V257H427.645V169.7C427.645 161.5 426.845 154.7 425.245 149.3C423.645 143.9 420.945 139.9 417.145 137.3C413.545 134.5 408.745 133.1 402.745 133.1C396.545 133.1 391.245 134.7 386.845 137.9C382.645 141.1 379.345 145.2 376.945 150.2C374.745 155.2 373.645 160.5 373.645 166.1V257H322.945ZM671.4 260C661.8 260 653.1 258.3 645.3 254.9C637.5 251.3 630.7 246 624.9 239C619.3 232 615 223.3 612 212.9C609 202.3 607.5 190 607.5 176C607.5 157.2 610.1 141.6 615.3 129.2C620.7 116.6 628.2 107.3 637.8 101.3C647.4 95.1 658.6 92 671.4 92C679.6 92 686.9 93.2 693.3 95.6C699.9 98 705.5 101.4 710.1 105.8C714.9 110.2 718.6 115.4 721.2 121.4H723.9L725.7 95H774.6V257H723.9V230.6H721.2C717.4 239.4 711.2 246.5 702.6 251.9C694 257.3 683.6 260 671.4 260ZM691.2 219.2C698.8 219.2 704.9 217.5 709.5 214.1C714.1 210.5 717.5 206 719.7 200.6C722.1 195 723.3 189.2 723.3 183.2V168.8C723.3 162.6 722.1 156.8 719.7 151.4C717.5 145.8 714.1 141.3 709.5 137.9C704.9 134.5 698.8 132.8 691.2 132.8C684.8 132.8 679.2 134.3 674.4 137.3C669.6 140.3 665.8 145 663 151.4C660.4 157.6 659.1 165.8 659.1 176C659.1 186 660.4 194.2 663 200.6C665.8 207 669.6 211.7 674.4 214.7C679.2 217.7 684.8 219.2 691.2 219.2ZM878.936 260C861.736 260 847.036 256.6 834.836 249.8C822.836 242.8 813.636 233.1 807.236 220.7C800.836 208.3 797.636 193.8 797.636 177.2C797.636 159.8 800.836 144.7 807.236 131.9C813.836 119.1 823.136 109.3 835.136 102.5C847.136 95.5 861.136 92 877.136 92C896.136 92 911.736 96.2 923.936 104.6C936.136 112.8 944.836 124.1 950.036 138.5C955.436 152.9 957.236 169.3 955.436 187.7H847.436C847.236 195.1 848.436 201.4 851.036 206.6C853.836 211.6 857.536 215.5 862.136 218.3C866.936 220.9 872.536 222.2 878.936 222.2C886.136 222.2 892.236 220.6 897.236 217.4C902.236 214.2 905.436 210.1 906.836 205.1H954.236C953.036 216.1 949.036 225.7 942.236 233.9C935.636 242.1 926.836 248.5 915.836 253.1C905.036 257.7 892.736 260 878.936 260ZM847.436 161.3L843.236 156.8H910.136L905.636 161.3C906.036 154.3 905.036 148.5 902.636 143.9C900.436 139.3 897.136 135.8 892.736 133.4C888.336 131 883.136 129.8 877.136 129.8C870.936 129.8 865.636 131.1 861.236 133.7C856.836 136.1 853.436 139.7 851.036 144.5C848.636 149.3 847.436 154.9 847.436 161.3ZM981.832 257V38.3H1033.43V157.4L1046.33 141.8L1088.33 95H1150.73L1088.33 159.5L1151.33 257H1091.63L1062.53 210.2L1052.93 193.1L1033.43 212.6V257H981.832ZM1172.78 257V212.3H1220.48V257H1172.78ZM1307.14 260C1297.54 260 1288.84 258.3 1281.04 254.9C1273.24 251.3 1266.44 246 1260.64 239C1255.04 232 1250.74 223.3 1247.74 212.9C1244.74 202.3 1243.24 190 1243.24 176C1243.24 157.2 1245.84 141.6 1251.04 129.2C1256.44 116.6 1263.94 107.3 1273.54 101.3C1283.14 95.1 1294.34 92 1307.14 92C1315.34 92 1322.64 93.2 1329.04 95.6C1335.64 98 1341.24 101.4 1345.84 105.8C1350.64 110.2 1354.34 115.4 1356.94 121.4H1359.64L1361.44 95H1410.34V257H1359.64V230.6H1356.94C1353.14 239.4 1346.94 246.5 1338.34 251.9C1329.74 257.3 1319.34 260 1307.14 260ZM1326.94 219.2C1334.54 219.2 1340.64 217.5 1345.24 214.1C1349.84 210.5 1353.24 206 1355.44 200.6C1357.84 195 1359.04 189.2 1359.04 183.2V168.8C1359.04 162.6 1357.84 156.8 1355.44 151.4C1353.24 145.8 1349.84 141.3 1345.24 137.9C1340.64 134.5 1334.54 132.8 1326.94 132.8C1320.54 132.8 1314.94 134.3 1310.14 137.3C1305.34 140.3 1301.54 145 1298.74 151.4C1296.14 157.6 1294.84 165.8 1294.84 176C1294.84 186 1296.14 194.2 1298.74 200.6C1301.54 207 1305.34 211.7 1310.14 214.7C1314.94 217.7 1320.54 219.2 1326.94 219.2ZM1445.02 257V95H1495.72V257H1445.02ZM1445.02 76.1V38.3H1495.72V76.1H1445.02Z'
            className='fill-zinc-900 dark:fill-zinc-400'
          />
          <path
            d='M221.25 263.125C232.356 263.125 243.007 258.713 250.86 250.86C258.713 243.007 263.125 232.356 263.125 221.25L263.125 202.812C263.125 199.041 261.627 195.425 258.96 192.758C256.294 190.092 252.677 188.594 248.906 188.594C245.135 188.594 241.519 190.092 238.852 192.758C236.186 195.425 234.687 199.041 234.687 202.813L234.687 221.25C234.687 224.814 233.272 228.232 230.752 230.752C228.232 233.272 224.814 234.688 221.25 234.688L202.812 234.688C199.041 234.688 195.425 236.186 192.758 238.852C190.092 241.519 188.594 245.135 188.594 248.906C188.594 252.677 190.092 256.294 192.758 258.96C195.425 261.627 199.041 263.125 202.813 263.125L221.25 263.125ZM92.1875 263.125C95.9585 263.125 99.5751 261.627 102.242 258.96C104.908 256.294 106.406 252.677 106.406 248.906C106.406 245.135 104.908 241.519 102.242 238.852C99.5751 236.186 95.9585 234.688 92.1875 234.688L73.75 234.688C70.1862 234.688 66.7683 233.272 64.2483 230.752C61.7282 228.232 60.3125 224.814 60.3125 221.25L60.3125 202.813C60.3125 199.041 58.8145 195.425 56.1479 192.758C53.4814 190.092 49.8648 188.594 46.0937 188.594C42.3227 188.594 38.7061 190.092 36.0396 192.758C33.373 195.425 31.875 199.041 31.875 202.813L31.875 221.25C31.875 232.356 36.2868 243.007 44.1399 250.86C51.993 258.713 62.6441 263.125 73.75 263.125L92.1875 263.125ZM147.5 120.382C147.658 120.557 147.845 120.783 148.062 121.07C149.215 122.602 150.525 125.029 151.95 128.303C154.781 134.809 157.584 143.504 160.376 152.26C160.49 152.619 160.605 152.979 160.719 153.338C163.337 161.554 165.967 169.809 168.495 175.565C169.761 178.447 171.278 181.379 173.147 183.28C174.095 184.243 175.666 185.496 177.856 185.752C180.33 186.041 182.321 184.937 183.629 183.629C193.211 174.047 198.594 161.051 198.594 147.5C198.594 133.949 193.211 120.953 183.629 111.371C174.047 101.789 161.051 96.4063 147.5 96.4063C133.949 96.4063 120.953 101.789 111.371 111.371C101.789 120.953 96.4062 133.949 96.4062 147.5C96.4062 161.051 101.789 174.047 111.371 183.629C112.679 184.937 114.67 186.041 117.144 185.752C119.334 185.496 120.905 184.243 121.853 183.28C123.722 181.379 125.239 178.447 126.505 175.565C129.033 169.809 131.663 161.554 134.281 153.338C134.395 152.979 134.51 152.619 134.624 152.26C137.416 143.504 140.219 134.809 143.05 128.303C144.475 125.029 145.785 122.602 146.938 121.07C147.155 120.783 147.342 120.557 147.5 120.382ZM234.687 92.1875C234.687 95.9585 236.186 99.5751 238.852 102.242C241.519 104.908 245.135 106.406 248.906 106.406C252.677 106.406 256.294 104.908 258.96 102.242C261.627 99.5751 263.125 95.9585 263.125 92.1875L263.125 73.75C263.125 62.6441 258.713 51.993 250.86 44.1399C243.007 36.2868 232.356 31.875 221.25 31.875L202.812 31.875C199.041 31.875 195.425 33.373 192.758 36.0396C190.092 38.7061 188.594 42.3227 188.594 46.0938C188.594 49.8648 190.092 53.4814 192.758 56.1479C195.425 58.8145 199.041 60.3125 202.812 60.3125L221.25 60.3125C224.814 60.3125 228.232 61.7282 230.752 64.2483C233.272 66.7683 234.687 70.1862 234.687 73.75L234.687 92.1875ZM31.875 92.1875C31.875 95.9585 33.373 99.5751 36.0396 102.242C38.7061 104.908 42.3227 106.406 46.0937 106.406C49.8648 106.406 53.4814 104.908 56.1479 102.242C58.8145 99.5751 60.3125 95.9585 60.3125 92.1875L60.3125 73.75C60.3125 70.1862 61.7282 66.7683 64.2482 64.2483C66.7683 61.7282 70.1861 60.3125 73.75 60.3125L92.1875 60.3125C95.9585 60.3125 99.5751 58.8145 102.242 56.1479C104.908 53.4814 106.406 49.8648 106.406 46.0938C106.406 42.3227 104.908 38.7061 102.242 36.0396C99.5751 33.373 95.9585 31.875 92.1875 31.875L73.75 31.875C62.644 31.875 51.993 36.2868 44.1399 44.1399C36.2868 51.993 31.875 62.6441 31.875 73.75L31.875 92.1875Z'
            className='fill-zinc-900 dark:fill-zinc-400 stroke-zinc-900 dark:stroke-zinc-400'
            strokeWidth='10'
          />
        </svg>
      )
    case 'square':
      return (
        <svg
          viewBox='0 0 801 801'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <rect
            width='801'
            height='801'
            rx='32'
            className='fill-zinc-900 dark:fill-zinc-400'
          />
          <path
            d='M601.02 701.01C627.539 701.01 652.971 690.475 671.723 671.723C690.475 652.971 701.01 627.539 701.01 601.02L701.01 551.024C701.01 544.395 698.376 538.036 693.688 533.348C689 528.661 682.642 526.027 676.012 526.027C669.382 526.027 663.024 528.661 658.336 533.348C653.648 538.036 651.015 544.395 651.015 551.024L651.015 601.02C651.015 614.279 645.747 626.996 636.371 636.371C626.996 645.747 614.279 651.015 601.02 651.015L551.024 651.015C544.395 651.015 538.036 653.648 533.348 658.336C528.661 663.024 526.027 669.382 526.027 676.012C526.027 682.642 528.661 689 533.348 693.688C538.036 698.376 544.395 701.01 551.024 701.01L601.02 701.01ZM251.054 701.01C257.683 701.01 264.042 698.376 268.73 693.688C273.418 689 276.051 682.642 276.051 676.012C276.051 669.382 273.418 663.024 268.73 658.336C264.042 653.648 257.683 651.015 251.054 651.015L201.059 651.015C187.799 651.015 175.083 645.747 165.707 636.371C156.331 626.996 151.063 614.279 151.063 601.02L151.063 551.024C151.063 544.395 148.43 538.036 143.742 533.349C139.054 528.661 132.696 526.027 126.066 526.027C119.436 526.027 113.078 528.661 108.39 533.349C103.702 538.036 101.068 544.395 101.068 551.024L101.068 601.02C101.068 627.539 111.603 652.972 130.355 671.723C149.107 690.475 174.539 701.01 201.059 701.01L251.054 701.01ZM401.039 312.659C434.188 312.659 465.979 512.859 489.419 489.419C512.858 465.979 526.027 434.188 526.027 401.039C526.027 367.89 512.858 336.099 489.419 312.659C465.979 289.22 434.188 276.051 401.039 276.051C367.89 276.051 336.099 289.22 312.659 312.659C289.22 336.099 276.051 367.89 276.051 401.039C276.051 434.188 289.22 465.979 312.659 489.419C336.099 512.859 367.89 312.659 401.039 312.659ZM651.015 251.054C651.015 257.683 653.648 264.042 658.336 268.73C663.024 273.418 669.382 276.051 676.012 276.051C682.642 276.051 689 273.418 693.688 268.73C698.376 264.042 701.01 257.683 701.01 251.054L701.01 201.059C701.01 174.539 690.475 149.107 671.723 130.355C652.971 111.603 627.539 101.068 601.019 101.068L551.024 101.068C544.395 101.068 538.036 103.702 533.348 108.39C528.66 113.078 526.027 119.436 526.027 126.066C526.027 132.696 528.66 139.054 533.348 143.742C538.036 148.43 544.395 151.063 551.024 151.063L601.019 151.063C614.279 151.063 626.995 156.331 636.371 165.707C645.747 175.083 651.015 187.799 651.015 201.059L651.015 251.054ZM101.068 251.054C101.068 257.683 103.702 264.042 108.39 268.73C113.078 273.418 119.436 276.051 126.066 276.051C132.696 276.051 139.054 273.418 143.742 268.73C148.43 264.042 151.063 257.683 151.063 251.054L151.063 201.059C151.063 187.799 156.331 175.083 165.707 165.707C175.083 156.331 187.799 151.063 201.058 151.063L251.054 151.063C257.683 151.063 264.042 148.43 268.73 143.742C273.417 139.054 276.051 132.696 276.051 126.066C276.051 119.436 273.417 113.078 268.73 108.39C264.042 103.702 257.683 101.068 251.054 101.068L201.058 101.068C174.539 101.068 149.106 111.603 130.355 130.355C111.603 149.107 101.068 174.54 101.068 201.059L101.068 251.054Z'
            className='fill-zinc-400 dark:fill-zinc-900'
          />
        </svg>
      )
    case 'text':
      return (
        <svg
          viewBox='0 0 1237 295'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            className='fill-zinc-900 dark:fill-zinc-400'
            d='M31.9449 255V93H81.1449L82.6449 120.9H85.0449C88.8449 110.5 95.0449 102.8 103.645 97.8C112.445 92.6 122.045 90 132.445 90C143.445 90 153.545 92.6 162.745 97.8C171.945 103 178.745 112.1 183.145 125.1H185.545C189.145 113.3 195.645 104.5 205.045 98.7C214.645 92.9 225.445 90 237.445 90C247.845 90 257.145 92.2 265.345 96.6C273.545 100.8 280.045 107.8 284.845 117.6C289.845 127.4 292.345 140.4 292.345 156.6V255H241.645V167.7C241.645 159.5 240.745 152.7 238.945 147.3C237.345 141.9 234.645 137.9 230.845 135.3C227.245 132.5 222.445 131.1 216.445 131.1C210.245 131.1 204.945 132.7 200.545 135.9C196.345 139.1 193.145 143.2 190.945 148.2C188.745 153.2 187.645 158.5 187.645 164.1V255H136.645V167.7C136.645 159.5 135.845 152.7 134.245 147.3C132.645 141.9 129.945 137.9 126.145 135.3C122.545 132.5 117.745 131.1 111.745 131.1C105.545 131.1 100.245 132.7 95.8449 135.9C91.6449 139.1 88.3449 143.2 85.9449 148.2C83.7449 153.2 82.6449 158.5 82.6449 164.1V255H31.9449ZM380.4 258C370.8 258 362.1 256.3 354.3 252.9C346.5 249.3 339.7 244 333.9 237C328.3 230 324 221.3 321 210.9C318 200.3 316.5 188 316.5 174C316.5 155.2 319.1 139.6 324.3 127.2C329.7 114.6 337.2 105.3 346.8 99.3C356.4 93.1 367.6 90 380.4 90C388.6 90 395.9 91.2 402.3 93.6C408.9 96 414.5 99.4 419.1 103.8C423.9 108.2 427.6 113.4 430.2 119.4H432.9L434.7 93H483.6V255H432.9V228.6H430.2C426.4 237.4 420.2 244.5 411.6 249.9C403 255.3 392.6 258 380.4 258ZM400.2 217.2C407.8 217.2 413.9 215.5 418.5 212.1C423.1 208.5 426.5 204 428.7 198.6C431.1 193 432.3 187.2 432.3 181.2V166.8C432.3 160.6 431.1 154.8 428.7 149.4C426.5 143.8 423.1 139.3 418.5 135.9C413.9 132.5 407.8 130.8 400.2 130.8C393.8 130.8 388.2 132.3 383.4 135.3C378.6 138.3 374.8 143 372 149.4C369.4 155.6 368.1 163.8 368.1 174C368.1 184 369.4 192.2 372 198.6C374.8 205 378.6 209.7 383.4 212.7C388.2 215.7 393.8 217.2 400.2 217.2ZM587.936 258C570.736 258 556.036 254.6 543.836 247.8C531.836 240.8 522.636 231.1 516.236 218.7C509.836 206.3 506.636 191.8 506.636 175.2C506.636 157.8 509.836 142.7 516.236 129.9C522.836 117.1 532.136 107.3 544.136 100.5C556.136 93.5 570.136 90 586.136 90C605.136 90 620.736 94.2 632.936 102.6C645.136 110.8 653.836 122.1 659.036 136.5C664.436 150.9 666.236 167.3 664.436 185.7H556.436C556.236 193.1 557.436 199.4 560.036 204.6C562.836 209.6 566.536 213.5 571.136 216.3C575.936 218.9 581.536 220.2 587.936 220.2C595.136 220.2 601.236 218.6 606.236 215.4C611.236 212.2 614.436 208.1 615.836 203.1H663.236C662.036 214.1 658.036 223.7 651.236 231.9C644.636 240.1 635.836 246.5 624.836 251.1C614.036 255.7 601.736 258 587.936 258ZM556.436 159.3L552.236 154.8H619.136L614.636 159.3C615.036 152.3 614.036 146.5 611.636 141.9C609.436 137.3 606.136 133.8 601.736 131.4C597.336 129 592.136 127.8 586.136 127.8C579.936 127.8 574.636 129.1 570.236 131.7C565.836 134.1 562.436 137.7 560.036 142.5C557.636 147.3 556.436 152.9 556.436 159.3ZM690.832 255V36.3H742.432V155.4L755.332 139.8L797.332 93H859.732L797.332 157.5L860.332 255H800.632L771.532 208.2L761.932 191.1L742.432 210.6V255H690.832ZM881.777 255V210.3H929.477V255H881.777ZM1016.14 258C1006.54 258 997.842 256.3 990.042 252.9C982.242 249.3 975.442 244 969.642 237C964.042 230 959.742 221.3 956.742 210.9C953.742 200.3 952.242 188 952.242 174C952.242 155.2 954.842 139.6 960.042 127.2C965.442 114.6 972.942 105.3 982.542 99.3C992.142 93.1 1003.34 90 1016.14 90C1024.34 90 1031.64 91.2 1038.04 93.6C1044.64 96 1050.24 99.4 1054.84 103.8C1059.64 108.2 1063.34 113.4 1065.94 119.4H1068.64L1070.44 93H1119.34V255H1068.64V228.6H1065.94C1062.14 237.4 1055.94 244.5 1047.34 249.9C1038.74 255.3 1028.34 258 1016.14 258ZM1035.94 217.2C1043.54 217.2 1049.64 215.5 1054.24 212.1C1058.84 208.5 1062.24 204 1064.44 198.6C1066.84 193 1068.04 187.2 1068.04 181.2V166.8C1068.04 160.6 1066.84 154.8 1064.44 149.4C1062.24 143.8 1058.84 139.3 1054.24 135.9C1049.64 132.5 1043.54 130.8 1035.94 130.8C1029.54 130.8 1023.94 132.3 1019.14 135.3C1014.34 138.3 1010.54 143 1007.74 149.4C1005.14 155.6 1003.84 163.8 1003.84 174C1003.84 184 1005.14 192.2 1007.74 198.6C1010.54 205 1014.34 209.7 1019.14 212.7C1023.94 215.7 1029.54 217.2 1035.94 217.2ZM1154.02 255V93H1204.72V255H1154.02ZM1154.02 74.1V36.3H1204.72V74.1H1154.02Z'
          />
        </svg>
      )
    case 'square-transparent':
      return (
        <svg
          className={className}
          viewBox='0 0 800 800'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M600.02 700.01C626.539 700.01 651.971 689.475 670.723 670.723C689.475 651.971 700.01 626.539 700.01 600.02L700.01 550.024C700.01 543.395 697.376 537.036 692.688 532.348C688 527.661 681.642 525.027 675.012 525.027C668.382 525.027 662.024 527.661 657.336 532.348C652.648 537.036 650.015 543.395 650.015 550.024L650.015 600.02C650.015 613.279 644.747 625.996 635.371 635.371C625.996 644.747 613.279 650.015 600.02 650.015L550.024 650.015C543.395 650.015 537.036 652.648 532.348 657.336C527.661 662.024 525.027 668.382 525.027 675.012C525.027 681.642 527.661 688 532.348 692.688C537.036 697.376 543.395 700.01 550.024 700.01L600.02 700.01ZM250.054 700.01C256.683 700.01 263.042 697.376 267.73 692.688C272.418 688 275.051 681.642 275.051 675.012C275.051 668.382 272.418 662.024 267.73 657.336C263.042 652.648 256.683 650.015 250.054 650.015L200.059 650.015C186.799 650.015 174.083 644.747 164.707 635.371C155.331 625.996 150.063 613.279 150.063 600.02L150.063 550.024C150.063 543.395 147.43 537.036 142.742 532.349C138.054 527.661 131.696 525.027 125.066 525.027C118.436 525.027 112.078 527.661 107.39 532.349C102.702 537.036 100.068 543.395 100.068 550.024L100.068 600.02C100.068 626.539 110.603 651.972 129.355 670.723C148.107 689.475 173.539 700.01 200.059 700.01L250.054 700.01ZM400.039 311.659C433.188 311.659 464.979 511.859 488.419 488.419C511.858 464.979 525.027 433.188 525.027 400.039C525.027 366.89 511.858 335.099 488.419 311.659C464.979 288.22 433.188 275.051 400.039 275.051C366.89 275.051 335.099 288.22 311.659 311.659C288.22 335.099 275.051 366.89 275.051 400.039C275.051 433.188 288.22 464.979 311.659 488.419C335.099 511.859 366.89 311.659 400.039 311.659ZM650.015 250.054C650.015 256.683 652.648 263.042 657.336 267.73C662.024 272.418 668.382 275.051 675.012 275.051C681.642 275.051 688 272.418 692.688 267.73C697.376 263.042 700.01 256.683 700.01 250.054L700.01 200.059C700.01 173.539 689.475 148.107 670.723 129.355C651.971 110.603 626.539 100.068 600.019 100.068L550.024 100.068C543.395 100.068 537.036 102.702 532.348 107.39C527.66 112.078 525.027 118.436 525.027 125.066C525.027 131.696 527.66 138.054 532.348 142.742C537.036 147.43 543.395 150.063 550.024 150.063L600.019 150.063C613.279 150.063 625.995 155.331 635.371 164.707C644.747 174.083 650.015 186.799 650.015 200.059L650.015 250.054ZM100.068 250.054C100.068 256.683 102.702 263.042 107.39 267.73C112.078 272.418 118.436 275.051 125.066 275.051C131.696 275.051 138.054 272.418 142.742 267.73C147.43 263.042 150.063 256.683 150.063 250.054L150.063 200.059C150.063 186.799 155.331 174.083 164.707 164.707C174.083 155.331 186.799 150.063 200.058 150.063L250.054 150.063C256.683 150.063 263.042 147.43 267.73 142.742C272.417 138.054 275.051 131.696 275.051 125.066C275.051 118.436 272.417 112.078 267.73 107.39C263.042 102.702 256.683 100.068 250.054 100.068L200.058 100.068C173.539 100.068 148.106 110.603 129.355 129.355C110.603 148.107 100.068 173.54 100.068 200.059L100.068 250.054Z'
            className='fill-zinc-900 dark:fill-zinc-400'
          />
        </svg>
      )
    default:
      return null
  }
}