import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScrollToTop } from '@/shared/hooks/useScrollToTop';
import {
  Box,
  VStack,
  HStack,
  Card,
  Text,
  Button,
  Heading,
  Table,
  Alert,
  Checkbox,
  Link,
  Separator,
} from '@chakra-ui/react';
import PageContainer from '@/shared/components/layout/PageContainer';
import AnimatedCard from '@/shared/components/ui/AnimatedCard';
import PageActions from '@/shared/components/ui/PageActions';
import {
  LuCalendar,
  LuClock,
  LuUsers,
  LuMapPin,
  LuUser,
  LuBuilding2,
  LuMail,
  LuPhone,
  LuIdCard,
  LuTarget,
  LuExternalLink,
} from 'react-icons/lu';
import { ReservationCreateRequest } from '@/shared/types';
import { createReservation } from '@/lib/functions';
import { formatRoomLabel } from '@/shared/utils';

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);

  const formData = location.state?.reservationData as ReservationCreateRequest;

  // ページロード時にトップにスクロール
  useScrollToTop();

  const handleConfirm = async () => {
    if (!guidelinesAccepted) {
      setError('使用事項とガイドラインへの同意が必要です。');
      return;
    }

    setSubmitting(true);
    setError(''); // エラーメッセージをクリア

    try {
      // createReservationはリトライ機能付き（最大3回試行）
      const data = await createReservation(formData);

      // 成功した場合、レスポンスから適切にtokenを取得
      const token = data.token || data;

      navigate(`/complete/${token}`, {
        state: {
          message: '予約を確定しました',
          type: 'reserve',
        },
      });
    } catch (error: any) {
      console.error('予約確定エラー:', error);

      // ApiErrorからメッセージを取得
      let errorMessage = '予約の確定に失敗しました。もう一度お試しください。';

      if (error?.message) {
        errorMessage = error.message;
      }

      // 特定のエラーメッセージに対する分かりやすい表示
      if (errorMessage.includes('指定された時間帯に既に予約が存在します')) {
        errorMessage =
          '申し訳ございません。選択された時間帯は既に予約されています。別の時間帯をお選びください。';
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoHome = () => {
    // 入力内容を復元するためにreservationDataをstateで渡す
    navigate('/reserve', { state: { reservationData: formData } });
  };

  if (!formData) {
    return (
      <Box p={2} maxW="800px" mx="auto">
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>エラー</Alert.Title>
          <Alert.Description>予約データが見つかりません</Alert.Description>
        </Alert.Root>
        <Button mt={4} onClick={() => navigate('/reserve')}>
          予約ページに戻る
        </Button>
      </Box>
    );
  }

  return (
    <PageContainer
      title="予約内容確認"
      titleColor="blue.500"
      subtitle="以下の内容で予約を確定してもよろしいですか？"
    >
      <VStack gap={6} align="stretch">
        {/* 予約者情報カード */}
        <AnimatedCard delay={0.1}>
          <Card.Header>
            <Heading size="lg">予約者情報</Heading>
          </Card.Header>
          <Card.Body>
            <Table.Root size="md" variant="outline">
              <Table.Body>
                <Table.Row>
                  <Table.Cell fontWeight="bold" w="180px">
                    <HStack>
                      <LuIdCard />
                      <Text>学籍番号</Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>{formData.studentId}</Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell fontWeight="bold">
                    <HStack>
                      <LuUser />
                      <Text>予約者氏名</Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    {formData.firstName} {formData.lastName}
                  </Table.Cell>
                </Table.Row>

                {formData.clubName && (
                  <Table.Row>
                    <Table.Cell fontWeight="bold">
                      <HStack>
                        <LuBuilding2 />
                        <Text>団体名</Text>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>{formData.clubName}</Table.Cell>
                  </Table.Row>
                )}

                <Table.Row>
                  <Table.Cell fontWeight="bold">
                    <HStack>
                      <LuMail />
                      <Text>メールアドレス</Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>{formData.email}</Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell fontWeight="bold">
                    <HStack>
                      <LuPhone />
                      <Text>電話番号</Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>{formData.phoneNumber}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Card.Body>
        </AnimatedCard>

        {/* 予約詳細カード */}
        <AnimatedCard delay={0.2}>
          <Card.Header>
            <Heading size="lg">予約詳細</Heading>
          </Card.Header>
          <Card.Body>
            <Table.Root size="md" variant="outline">
              <Table.Body>
                <Table.Row>
                  <Table.Cell fontWeight="bold" w="180px">
                    <HStack>
                      <LuMapPin />
                      <Text>部屋</Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>ミーティングルーム{formatRoomLabel(formData.room)}</Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell fontWeight="bold">
                    <HStack>
                      <LuCalendar />
                      <Text>使用日</Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>{formData.reservationDate}</Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell fontWeight="bold">
                    <HStack>
                      <LuClock />
                      <Text>使用時間</Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    {formData.startTime} ～ {formData.endTime}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell fontWeight="bold">
                    <HStack>
                      <LuUsers />
                      <Text>人数</Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>{formData.numPeople}人</Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell fontWeight="bold">
                    <HStack>
                      <LuTarget />
                      <Text>利用目的</Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>{formData.purpose}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Card.Body>
        </AnimatedCard>

        {/* 使用事項とガイドライン確認 */}
        <AnimatedCard delay={0.3}>
          <Card.Root borderColor={guidelinesAccepted ? 'green.300' : 'red.300'} borderWidth="2px">
            <Card.Header bg={guidelinesAccepted ? 'green.50' : 'red.50'}>
              <Heading size="lg" color={guidelinesAccepted ? 'green.700' : 'red.700'}>
                <HStack>
                  <Text>
                    {guidelinesAccepted ? '✅' : '⚠️'} 使用事項とガイドラインの確認（必須）
                  </Text>
                </HStack>
              </Heading>
            </Card.Header>
            <Card.Body>
              <VStack gap={4} align="stretch">
                <Text fontSize="sm" color="gray.800" lineHeight="1.7" fontWeight="medium">
                  予約を確定する前に、以下の使用事項とガイドラインをご確認ください：
                </Text>

                <Box p={4} bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200">
                  <VStack gap={2} align="stretch">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                      📋 使用事項（必読）
                    </Text>
                    <Text fontSize="xs" color="gray.700" lineHeight="1.6">
                      • ミーティングルーム使用規程を厳守すること
                      <br />• 職員、保安員が許可書の提示を求めたときは、ただちに提示すること
                      <br />• 使用中施設に損害を与えたときは、修理費等の経費負担をすること
                      <br />•
                      課外活動で使用する場合、「課外活動の承認に関するガイドライン」を遵守すること
                    </Text>
                  </VStack>
                </Box>

                <Box p={3} bg="blue.50" borderRadius="md" borderWidth="1px" borderColor="blue.200">
                  <VStack gap={2} align="stretch">
                    <Text fontSize="sm" fontWeight="semibold" color="blue.800">
                      📋 課外活動の承認に関するガイドライン
                    </Text>
                    <HStack>
                      <Link
                        href="https://www.u-hyogo.ac.jp/cnas/corona/pdf/activities_guide_R31129.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="blue.600"
                        fontSize="sm"
                        _hover={{ color: 'blue.800' }}
                      >
                        <HStack gap={1}>
                          <Text>ガイドラインを確認する</Text>
                          <LuExternalLink size="14px" />
                        </HStack>
                      </Link>
                    </HStack>
                  </VStack>
                </Box>

                <Separator />

                <Box
                  p={3}
                  bg="yellow.50"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="yellow.200"
                >
                  <Checkbox.Root
                    checked={guidelinesAccepted}
                    onCheckedChange={(e) => setGuidelinesAccepted(!!e.checked)}
                    size="md"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label fontSize="sm" fontWeight="medium" color="yellow.800">
                      上記の使用事項およびガイドラインを確認し、遵守することに同意します（予約確定に必須）
                    </Checkbox.Label>
                  </Checkbox.Root>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        </AnimatedCard>

        {/* 注意事項 */}
        <Box>
          <Alert.Root status="info">
            <Alert.Indicator />
            <Box>
              <Alert.Title>予約確定に関する注意</Alert.Title>
              <Alert.Description>
                • 予約確定後は管理者による承認待ちとなります
                <br />
                • 承認結果はメールにてお知らせいたします
                <br />• 予約内容に間違いがないか再度ご確認ください
              </Alert.Description>
            </Box>
          </Alert.Root>
        </Box>

        {/* エラーメッセージ */}
        {error && (
          <Box>
            <Alert.Root status="error">
              <Alert.Indicator />
              <Box>
                <Alert.Title>予約エラー</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
              </Box>
            </Alert.Root>
          </Box>
        )}

        {/* ガイドライン同意確認メッセージ */}
        {!guidelinesAccepted && (
          <Box textAlign="center">
            <Text color="red.600" fontSize="sm" fontWeight="medium">
              予約を確定するには、使用事項とガイドラインへの同意が必要です
            </Text>
          </Box>
        )}

        {/* ボタン */}
        <PageActions delay={0.5}>
          <Button size="lg" variant="outline" onClick={handleGoHome} disabled={submitting}>
            修正する
          </Button>
          <Button
            size="lg"
            colorScheme="blue"
            onClick={handleConfirm}
            loading={submitting}
            loadingText="処理中..."
            disabled={!guidelinesAccepted || submitting}
            opacity={guidelinesAccepted ? 1 : 0.5}
            cursor={guidelinesAccepted ? 'pointer' : 'not-allowed'}
          >
            予約を確定する
          </Button>
        </PageActions>
      </VStack>
    </PageContainer>
  );
}
