import React, { VFC, useEffect, useState } from 'react';

// GoogleFitから取得するデータ型
export type QueryData = {
  endDate: Date;
  startDate: Date;
  unit: string;
  value: number;
};

const StepList: VFC = () => {
  const [stepData, setStepData] = useState<QueryData[]>();
  const logErr = (err: any) => console.log(`${err}`);

  // 日付フォーマット(yyyy/MM/dd(ddd))
  const df = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });

  useEffect(() => {
    const health = (navigator as any).health;
    // GoogleFitが利用可能かどうか表示する
    health.isAvailable((available: boolean) => {
      if (available) {
        // Google Fitがインストールされていない場合、インストール用ダイアログを表示
        health.promptInstallFit(() => {
          // 歩数データの読み取りアクセスを要求
          health.requestAuthorization(
            [{ read: ['steps'] }],
            () => {
              // 期間とタイプ(歩数)を指定してデータを取得する
              health.queryAggregated(
                {
                  startDate: new Date(
                    new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
                  ),
                  endDate: new Date(),
                  dataType: 'steps',
                  bucket: 'day',
                },
                (data: QueryData[]) => {
                  // 取得したデータをstateに保存(変更後、画面が再描画される)
                  setStepData(data);
                },
                logErr,
              );
            },
            logErr,
          );
        }, logErr);
      }
    }, logErr);
  }, []);

  // [日付 : 歩数] の形で画面に表示する
  return (
    <>
      <div>
        {stepData?.map((item) => (
          <div>{`${df.format(item.startDate)} : ${item.value}`}</div>
        ))}
      </div>
    </>
  );
};

export default StepList;
